import jwt from 'jsonwebtoken';

// import cookies
import { setCookieHandler } from './cookies';

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
        async (error, token) => {
            if (error) {
                res.status(401).json({
                    success: false,
                    message: "User authentication failed!"
                });
            };

            const tokenStr = "Bearer " + token;

            // set the cookie
            setCookieHandler(req, res, "token", tokenStr)


            // it then returns a http response with bearer token. However
            // the best solution would be setting cookies.
            res.status(200).json({
                success: true,
                message: "Authentication successful"
            });

        }
    )

}

export function validateToken() {

}

export function renewToken() {

}