import { createCourse, getCourseById, updateCourseThumbnail } from '@/data/dbTransactions/course.dbTransaction';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { validateFileExtension, validateFileSize } from '@/utils/validation/validateFiles';
import { validateCourseOwnership } from '@/utils/validation/validateCourseOwnership';


// Define storage location and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'public/thumbnails')); // Define private directory location
    },
});

// Initialize multer with storage
const upload = multer({ storage: storage });

export const config = {
    api: {
        bodyParser: false, // Disable default body parsing
    },
};


export default async function handler(req, res) {
    const { courseId } = req.query;

    if (req.method === 'POST') {
        // Get userId from user payload
        const userId = req.headers['x-user-payload'] ? JSON.parse(req.headers['x-user-payload']).userId : null;

        // Check if userId is available
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // validate user ownership of course
        if (!validateCourseOwnership(courseId, userId)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // create the directory if it doesn't exist
        if (!fs.existsSync(path.join(process.cwd(), 'public/thumbnails'))) {
            fs.mkdirSync(path.join(process.cwd(), 'public/thumbnails'), { recursive: true });
        }

        // attempt to upload the course thumbnail
        upload.single('thumbnail')(req, res, async (err) => {

            try {
                if (err) {
                    return res.status(500).json({ error: 'Error uploading file' });
                }

                // get the request data and file
                const thumbnail = req.file;
                const { courseName, hideCourse } = req.body;

                // create the course entry on db
                const newCourse = await createCourse({ courseName, userId, hideCourse });


                if (!newCourse) {
                    return res.status(500).json({ error: 'Failed to create course' });
                }
                
                if (thumbnail) {
                    // get the thumbnail file name
                    const thumbnailName = thumbnail.originalname;
                    // get the thumbnail file extension
                    const fileExtension = thumbnailName.split('.').pop();
                    // get the allowed file extensions
                    const allowedExtensions = ['jpg', 'jpeg', 'png'];

                    // validate file extension
                    if (validateFileExtension(fileExtension, allowedExtensions) !== null) {
                        return res.status(400).json({ error: 'Invalid file type: only jpg, jpeg, png are allowed' });
                    }

                    // validate file size to be less than 10MB
                    const fileSize = thumbnail.size;
                    if (validateFileSize(fileSize) !== null) {
                        return res.status(400).json({ error: 'File size must be less than 10MB' });
                    }

                    // make a new file name to be: courseName + courseId + 'thumbnail' + fileExtension, separated by '-'
                    const newFileName = `${newCourse.id}-${courseName.toLowerCase()}-thumbnail.${fileExtension}`;

                    // move the file to the public directory
                    fs.renameSync(thumbnail.path, path.join(process.cwd(), 'public/thumbnails', newFileName));

                    // update the course with the new thumbnail
                    await updateCourseThumbnail({
                        id: newCourse.id,
                        newThumbnail: newFileName
                    });
                }
            
            const thumbnailName = thumbnail.originalname;
            
        
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });

        //     try {
        //         // validate file to be an image
        //         const fileExtension = thumbnailName.split('.').pop();
        //         const allowedExtensions = ['jpg', 'jpeg', 'png'];
        //         if (validateFileExtension(fileExtension, allowedExtensions) !== null) {
        //             return res.status(400).json({ error: 'Invalid file type: only jpg, jpeg, png are allowed' });
        //         }

        //         // validate file size to be less than 10MB
        //         const fileSize = thumbnail.size;
        //         if (validateFileSize(fileSize) !== null) {
        //             return res.status(400).json({ error: 'File size must be less than 10MB' });
        //         }

        //         // create the course entry on db
        //         const newCourse = await createCourse({ courseName, userId, hideCourse });

        //         // validate the course creation
        //         if (!newCourse) {
        //             return res.status(500).json({ error: 'Failed to create course' });
        //         }

        //         // make a new file name to be: courseName + courseId + 'thumbnail' + fileExtension, separated by '-'
        //         const newFileName = `${newCourse.id}-${courseName.toLowerCase()}-thumbnail.${fileExtension}`;
                
        //         // move the file to the public directory
        //         fs.renameSync(thumbnail.path, path.join(process.cwd(), 'public/thumbnails', newFileName));

        //         // update the course with the new thumbnail
        //         await updateCourseThumbnail({
        //                 id: newCourse.id,
        //                 newThumbnail: newFileName
        //             });

        //         // get the updated course data
        //         return res.status(201).json({ message: 'Course created successfully' });

        //     } catch (error) {
        //         return res.status(500).json({ error: error.message });
        //     }
        // });

        res.status(200).json({ message: 'Course created successfully' });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
