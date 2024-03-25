import fs from 'fs';
import path from 'path';
import prisma from '@/data/prisma';

export default async function handler(req, res) {
  const { fileId } = req.query; // Assuming fileId is the unique ID of the file

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
    const fileStream = fs.createReadStream(filePath);

    // add a custom name for the file
    res.setHeader('Content-Disposition', `attachment; filename=${fileRecord.fileDisplayName}`);

    fileStream.on('open', function () {
      fileStream.pipe(res); // Send the file as a response
    });

    fileStream.on('error', function (err) {
      res.status(500).json({ error: 'Error reading file' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error accessing file' });
  }
}