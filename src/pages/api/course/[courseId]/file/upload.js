import prisma from '@/data/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

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

  // create the directory if it doesn't exist
  if (!fs.existsSync(path.join(process.cwd(), 'private/uploads'))) {
      fs.mkdirSync(path.join(process.cwd(), 'private/uploads'), { recursive: true });
  }

  upload.single('file')(req, res, async (err) => {
    if (err) {
      res.status(500).json({ error: 'Error uploading file' });
      return;
    }

    const { userId, lessonId } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    try {

      // only allow the following file types: docx, pdf, pptx, txt, jpg, jpeg, png, md, doc, xls, xlsx, csv
      const allowedFileTypes = ['docx', 'pdf', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'md', 'doc', 'xls', 'xlsx', 'csv'];
      const fileExtension = file.originalname.split('.').pop();
      if (!allowedFileTypes.includes(fileExtension)) {
        res.status(400).json({ error: 'Invalid file type: only docx, pdf, pptx, txt, jpg, jpeg, png, md, doc, xls, xlsx, csv are allowed' });
        return;
      }

      // Move the uploaded file to the private directory
      const newPath = path.join(process.cwd(), 'private/uploads', file.filename);
      fs.renameSync(file.path, newPath);

      // Store file information in the database
      const fileUpload = await prisma.fileUpload.create({
        data: {
          fileDisplayName: file.originalname,
          fileUniqueName: file.filename,
          userId: parseInt(userId),
          lessonId: parseInt(lessonId),
        },
      });

      if (!fileUpload) {
        res.status(500).json({ error: 'Error storing file in database' });
        return;
      }

      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error uploading file' });
    }
  });
}
