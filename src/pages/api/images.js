import fs from 'fs';

// this will feed the image to the Image components on the page
export default function handler(req, res) {
    // get the image name url parameter
    const { imageName } = req.query;

    // get current working directory
    const cwd = process.cwd();

    // get the image from the folder cwd/src/media/images
    const img = fs.readFileSync(`${cwd}/src/media/images/${imageName}`);
    // send the image to the client

    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(img);
}