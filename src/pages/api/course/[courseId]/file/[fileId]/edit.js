import prisma from '@/data/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { validateFileExtension, validateFileSize, validateFileName } from '@/utils/validation/validateFiles';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'private/uploads')); // Define private directory location
    },
    filename: function (req, file, cb) {
        const uniqueFilename = uuidv4(); // Generate unique ID for the filename
        cb(null, uniqueFilename + path.extname(file.originalname)); // Append original file extension
    },
});

const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { fileId, courseId } = req.query;

    // attempt to validate the user
    try {
        // get user payload from the headers to validate the user
        const userPayloadStr = req.headers['x-user-payload'];
        //parse user payload
        const userPayload = JSON.parse(userPayloadStr);

        // search the course on db record
        const course = await prisma.course.findUnique({
            where: {
                id: parseInt(courseId),
            },
        });

        if (!course) {
            throw new Error('Course not found');
        }

        if (course.userId !== userPayload.userId) {
            throw new Error('Unauthorized');
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    // create the directory if it doesn't exist
    if (!fs.existsSync(path.join(process.cwd(), 'private/uploads'))) {
        fs.mkdirSync(path.join(process.cwd(), 'private/uploads'), { recursive: true });
    }


    // find the file record in the database
    const fileRecord = await prisma.fileUpload.findUnique({
        where: {
            id: parseInt(fileId),
        },
    });

    if (!fileRecord) {
        res.status(404).json({ error: 'File not found' });
        return;
    }

    upload.single('file')(req, res, async (err) => {
        if (err) {
            res.status(500).json({ error: 'Error uploading file' });
            return;
        }

        const file = req.file;

        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        try {

            // validate file name to be a string and no longer than 100 characters
            const fileName = file.originalname;
            if (validateFileName(fileName) !== null) {
                res.status(400).json({ error: 'File name must be less than 100 characters' });
                return;
            }

            // only allow the following file types: docx, pdf, pptx, txt, jpg, jpeg, png, md, doc, xls, xlsx, csv
            const fileExtension = file.originalname.split('.').pop();
            if (validateFileExtension(fileExtension) !== null) {
                res.status(400).json({ error: 'Invalid file type: only docx, pdf, pptx, txt, jpg, jpeg, png, md, doc, xls, xlsx, csv are allowed' });
                return;
            }

            // validate file size to be a number and no larger than 10MB
            const fileSize = file.size;
            if (validateFileSize(fileSize) !== null) {
                res.status(400).json({ error: 'File size must be less than 10MB' });
                return;
            }

            // const oldFileDisplayName = fileRecord.fileDisplayName;
            const oldFileUniqueName = fileRecord.fileUniqueName;

            // update the file record in the database
            const newFileUpload = await prisma.fileUpload.update({
                where: {
                    id: parseInt(fileId),
                },
                data: {
                    fileDisplayName: file.originalname,
                    fileUniqueName: file.filename,
                },
            });

            if (!newFileUpload) {
                res.status(500).json({ error: 'Error updating file in database' });
                return;
            }

            // delete the old file by unique name
            const oldFilePath = path.join(process.cwd(), 'private/uploads', oldFileUniqueName);
            fs.unlinkSync(oldFilePath);

            // Move the uploaded file to the private directory
            const newPath = path.join(process.cwd(), 'private/uploads', file.filename);
            fs.renameSync(file.path, newPath);

            // return success message json
            res.status(200).json({ message: 'File uploaded successfully' });

        } catch (error) {
            res.status(500).json({ error: 'Error uploading file' });
        }
    }
  );
}
