import fs from 'fs';

// import get user by id crud transaction
import { getUserById } from '@/data/dbTransactions/user.dbTransaction';
import prisma from '@/data/prisma';



// this will feed the image to the Image components on the page
// later on this project, we will keep track of the images and their owners
// in the database, and verify if the user has access to the image
export default async function handler(req, res) {

    // get the user payload from the request headers
    const userPayload = await JSON.parse(req.headers['x-user-payload']);


    // get the userId and get the user using crud transactions
    const userId = userPayload.userId;
    // const user = await getUserById(userId);

    // get the image name url parameter
    const { imageName } = req.query;

    // the buffer that will hold the image file to send over http
    let imgFile = null;
    const IMG_ERROR_IMG = process.env.IMG_ERROR_IMG;

    // get current working directory
    const cwd = process.cwd();
    
    try {

        // get the thumbnail relation using prismas relation method
        const thumbnail = await prisma.thumbnail.findFirst({
            where: {
                thumbnail: imageName,
                userId: userId,
            },
        });

        // if the userId in the thumbnail relation is different from the user id
        // from the user payload, we will redirectot to unauthorized
        if (!thumbnail || thumbnail.userId !== userId) {
            // get the default error image from the folder cwd/src/media/images
            imgFile = fs.readFileSync(`${cwd}/src/media/images/default/${IMG_ERROR_IMG}`);

        } else {
            // get the image from the folder cwd/src/media/images using the url parameter
            imgFile = fs.readFileSync(`${cwd}/src/media/images/${imageName}`);

        }
        

    } catch (error) {
        // if anything goes wrong, we will send the default error image
        imgFile = fs.readFileSync(`${cwd}/src/media/images/default/${IMG_ERROR_IMG}`);
    
    }

    // add the content type header so it forces the response to be an image
    await res.setHeader('Content-Type', 'image/png');
    
    // send the image to the client
    await res.status(200).send(imgFile);
}