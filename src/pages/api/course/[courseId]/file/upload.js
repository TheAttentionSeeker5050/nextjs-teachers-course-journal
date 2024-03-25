import prisma from '@/data/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// const upload = multer({
//   dest: path.join(process.cwd(), 'public/uploads'),
// });

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
        console.error('Error uploading file:', err);
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
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
      }
    });
  }

// import fs from 'fs';
// import formidable from 'formidable';
// import path from 'path';

// // const prisma = new PrismaClient();

// export const config = {
//   api: {
//     bodyParser: false, // Disable body parsing, as formidable handles it
//   },
// };

// export default async function handler(req, res) {
//   if (req.method === 'POST') {

//     let form = new formidable.IncomingForm();
//     form.uploadDir = './public/uploads'; // Set the upload directory

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error('Error parsing form:', err);
//         res.status(500).json({ error: 'Error parsing form data' });
//         return;
//       }

//       const { userId, lessonId } = fields;
//       const { file } = files;
//       const { name: fileDisplayName, path: filePath } = file;

//       // Store file information in the database
//       try {
//         const fileUpload = await prisma.fileUpload.create({
//           data: {
//             fileDisplayName,
//             fileUniqueName: file.name, // You can adjust this as needed
//             userId: parseInt(userId),
//             lessonId: parseInt(lessonId),
//           },
//         });

//         // Move the uploaded file to the upload directory
//         fs.renameSync(filePath, `${form.uploadDir}/${file.name}`);

//         res.status(200).json({ message: 'File uploaded successfully', fileUpload });
//       } catch (error) {
//         console.error('Error storing file in database:', error);
//         res.status(500).json({ error: 'Error storing file in database' });
//       }
//     });
//   } else {
//     res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }

// // import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
// // import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";



// // export default async function (req, res) {
// //     // if different than post, return 405 method not allowed
// //     if (req.method !== 'POST') {
// //         return res.status(405).json({ message: "Method not allowed" });
// //     }import fs from 'fs';
// //     import formidable from 'formidable';
// //     import { PrismaClient } from '@prisma/client';
    
// //     const prisma = new PrismaClient();
    
// //     export const config = {
// //       api: {
// //         bodyParser: false, // Disable body parsing, as formidable handles it
// //       },
// //     };
    
// //     export default async function handler(req, res) {
// //       if (req.method === 'POST') {
// //         const form = new formidable.IncomingForm();
// //         form.uploadDir = './public/uploads'; // Set the upload directory
    
// //         form.parse(req, async (err, fields, files) => {
// //           if (err) {
// //             console.error('Error parsing form:', err);
// //             res.status(500).json({ error: 'Error parsing form data' });
// //             return;
// //           }
    
// //           const { userId, lessonId } = fields;
// //           const { file } = files;
// //           const { name: fileDisplayName, path: filePath } = file;
    
// //           // Store file information in the database
// //           try {
// //             const fileUpload = await prisma.fileUpload.create({
// //               data: {
// //                 fileDisplayName,
// //                 fileUniqueName: file.name, // You can adjust this as needed
// //                 userId: parseInt(userId),
// //                 lessonId: parseInt(lessonId),
// //               },
// //             });
    
// //             // Move the uploaded file to the upload directory
// //             fs.renameSync(filePath, `${form.uploadDir}/${file.name}`);
    
// //             res.status(200).json({ message: 'File uploaded successfully', fileUpload });
// //           } catch (error) {
// //             console.error('Error storing file in database:', error);
// //             res.status(500).json({ error: 'Error storing file in database' });
// //           }
// //         });
// //       } else {
// //         res.status(405).json({ error: 'Method Not Allowed' });
// //       }
// //     }
// //     const { courseId } = req.query

// //     // attempt to validate the course ownership
// //     try {
// //         // get the user payload from the headers x-user-payload
// //         const userPayloadStr = req.headers['x-user-payload']

// //         // get the course from the database
// //         const courseFromDB = await getCourseById(parseInt(courseId))

// //         // validate course ownership
// //         const courseValidationResult = await validateCourseOwnership(courseFromDB, userPayloadStr)

// //         // if the courseValidationResult is not null, return unauthorized
// //         if (courseValidationResult) {
// //             return res.status(401).json({ message: "Unauthorized" });
// //         }
        
// //     } catch (error) {
// //         return res.status(500).json({ message: "There was a problem retrieving the course data, please try again later" });
// //     }

// //     try {

// //         // get the form data and parse it
// //         const formData = req.body;
        

// //         // if no form data, no file uploaded, return request invalid
// //         if (!formData) {
// //             return res.status(400).json({ message: "Invalid request body" });
// //         }

// //         if (!req.body.lessonId) {
// //             return res.status(400).json({ message: "Lesson ID is required" });
// //         }

// //         if (!formData.userId) {
// //             return res.status(400).json({ message: "User ID is required" });
// //         }

// //         // if no file, return request invalid
// //         if (!formData.file) {
// //             return res.status(400).json({ message: "File is required" });
// //         }

// //         // if file is not formatted as a file, return request invalid
// //         if (typeof formData.file !== 'object') {
// //             return res.status(400).json({ message: "Invalid file format" });
// //         }



// //         res.status(200).json({ name: 'Example' })

// //     } catch (error) {
// //         console.error(error);
// //         return res.status(500).json({ message: "There was a problem uploading the file, please try again later" });
// //     }
// // }