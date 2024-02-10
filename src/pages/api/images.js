import fs from 'fs';

// this will feed the image to the Image components on the page
// later on this project, we will keep track of the images and their owners
// in the database, and verify if the user has access to the image
export default function handler(req, res) {
    // get the image name url parameter
    const { imageName } = req.query;

    // get current working directory
    const cwd = process.cwd();

    // get the image from the folder cwd/src/media/images
    const img = fs.readFileSync(`${cwd}/src/media/images/${imageName}`);
    
    // add the content type header so it forces the response to be an image
    res.setHeader('Content-Type', 'image/png');
    
    // send the image to the client
    res.status(200).send(img);
}