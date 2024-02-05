import { serialize } from "cookie"
// import cookie config
import { cookieConfig } from "@/utils/validation/cookies";

// import the create access token and create refresh token functions
import { createAccessToken, createRefreshToken } from "@/utils/validation/jwt";

// import the hash password function
import { hashPassword } from "@/utils/validation/passwordEncryption";

// this is not yet implemented, but this will be the function that will be used to
// get the user from the database. For now, it is just for testing our jwt, 
// password hash and cookies
export default async function handler(req, res) {
    // if (req.method !== 'POST') {
    //     return res.status(405).json({ message: 'Method not allowed' })
    // }

    // hash the password "password" with salt 10
    const hashedPassword = await hashPassword("password", 10)
        

    // create the access token and refresh token
    const accessToken = createAccessToken({ userId: 1, email: "john.doe@gmail.com" });
    const refreshToken = createRefreshToken({ userId: 1, email: "john.doe@gmail.com" });

    // make an array of the serialized cookies
    const newCookie = [
        serialize("accessToken", accessToken, cookieConfig),
        serialize("refreshToken", refreshToken, cookieConfig),
        // serialize("foo", "bar", cookieConfig)
    ]

    res.setHeader("Set-Cookie", newCookie)

    res.status(200).json({ name: 'John Doe' })
}