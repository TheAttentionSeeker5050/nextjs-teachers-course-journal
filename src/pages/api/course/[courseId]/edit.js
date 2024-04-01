import { updateCourse, getCourseById, updateCourseThumbnail } from "@/data/dbTransactions/course.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";
import { validateFileExtension, validateFileSize, validateFileName } from '@/utils/validation/validateFiles';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


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


    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }


    try {

        // Get userId from user payload
        const userId = req.headers['x-user-payload'] ? JSON.parse(req.headers['x-user-payload']).userId : null;

        // Check if userId is available
        if (!userId) {
            throw new Error("Unauthorized");
        }

        // get course by id
        const course = await getCourseById(parseInt(courseId));
        
        // validate user ownership of course
        const validationResult = await validateCourseOwnership(course, req.headers["x-user-payload"]);

        if (validationResult) {
            throw new Error("Unauthorized");
        }

    } catch (error) {
        res.status(401).json({ error: "Internal server error: " + error });
    }

    // create the directory if it doesn't exist
    if (!fs.existsSync(path.join(process.cwd(), 'public/thumbnails'))) {
        fs.mkdirSync(path.join(process.cwd(), 'public/thumbnails'), { recursive: true });
    }

    // attempt to upload the course thumbnail
    upload.single('thumbnail')(req, res, async (err) => {
        // if no file is uploaded, continue with updating course other details
        try {
            const thumbnail = req.file;
            // get the new course name and hide existing course
            const { courseName, hideCourse } = req.body;

            // update course name and hide course
            const updatedCourse = await updateCourse({
                id: parseInt(courseId),
                newCourseName: courseName,
                hideCourse: hideCourse
            });

            // if the course is not updated, we will throw an error
            if (!updatedCourse) {
                throw new Error("There was a problem updating the course, please try again later");
            }

            // write the name of the old thumbnail from the database to delete it later
            const oldThumbnail = updatedCourse.thumbnail;

            // we want the new course upload to be optional
            if (thumbnail) {
                // get thumbnail name
                const thumbnailName = thumbnail.originalname;
                // get the file extension
                const fileExtension = thumbnailName.split('.').pop();
                const allowedExtensions = ['jpg', 'jpeg', 'png'];
                // validate file extension
                if (validateFileExtension(fileExtension, allowedExtensions) !== null) {
                    throw new Error("Invalid file type: only jpg, jpeg, png are allowed");
                }

                // validate file size to be less than 10MB
                const fileSize = thumbnail.size;
                if (validateFileSize(fileSize) !== null) {
                    throw new Error("File size must be less than 10MB");
                }

                // make a new file name to be: courseName + courseId + 'thumbnail' + fileExtension, separated by '-'
                const newFileName = `${courseId}-${courseName.toLowerCase()}-thumbnail.${fileExtension}`;
                // move the file to the public directory
                fs.renameSync(thumbnail.path, path.join(process.cwd(), 'public/thumbnails', newFileName));

                // if the new name and old name are not the same, and the old name exists, delete the old thumbnail
                if (newFileName !== oldThumbnail && fs.existsSync(path.join(process.cwd(), 'public/thumbnails', oldThumbnail))) {
                    fs.unlinkSync(path.join(process.cwd(), 'public/thumbnails', oldThumbnail));
                }

                // update the course with the new thumbnail
                await updateCourseThumbnail({
                    id: parseInt(courseId),
                    newThumbnail: newFileName
                });

                
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    res.status(200).json({ message: "Course updated successfully" });
    
}
