import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// this will store the json web token handler functions

export async function createToken({ req, res, userId, userEmail }) {
    // create a payload object, it will store some info about the user
    const payload = {
        id: userId,
        email: userEmail
    };

    // expiration time in seconds
    const expiration = process.env.JWT_TOKEN_EXPIRATION_HOURS * 1000 * 60 * 60

    // now create or sign the token, meaning add the user info, the expiration and encrypt it
    var myToken = "";

    myToken = await jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: expiration
        },
        (error, token) => {
            // console.log("Error:", error);
            // console.log("Token:", token);

            // it then returns a http response with bearer token. However
            // the best solution would be setting cookies.
            res.status(200).json({
                success: true,
                token: "Bearer " + token
            })

        }
    )

}

export function validateToken() {

}

export function renewToken() {

}