import fs from 'fs';
import path from 'path';
import prisma from '@/data/prisma';


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
    }
    const { fileId } = req.query;

    try {

        // get user payload from the headers to validate the user
        const userPayloadStr = req.headers['x-user-payload'];
        //parse user payload
        const userPayload = JSON.parse(userPayloadStr);


        // search the file on db record
        const fileRecord = await prisma.fileUpload.findUnique({
            where: {
                id: parseInt(fileId),
            },
        });

        if (!fileRecord) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        // if the user is not the owner of the course, redirect to 404
        if (fileRecord.userId !== userPayload.userId) {
        return res.status(401).json({ message: "Unauthorized" });
        }

        const filePath = path.join(process.cwd(), 'private/uploads', fileRecord.fileUniqueName);

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Delete the file
            fs.unlinkSync(filePath);

            // delete the file record from the database
            await prisma.fileUpload.delete({
                where: {
                    id: parseInt(fileId),
                },
            });

            res.status(200).json({ message: 'File deleted successfully' });
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
  }
  