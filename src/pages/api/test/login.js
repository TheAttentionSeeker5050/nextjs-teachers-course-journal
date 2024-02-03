import { serialize } from "cookie"
// import cookie config
import { cookieConfig } from "@/utils/validation/cookies";

// import the create access token and create refresh token functions
import { createAccessToken, createRefreshToken } from "@/utils/validation/jwt";

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    // create the access token and refresh token
    const accessToken = createAccessToken(req, res, { userId: 1, email: "john.doe@gmail.com" });
    const refreshToken = createRefreshToken(req, res, { userId: 1, email: "john.doe@gmail.com" });

    // make an array of the serialized cookies
    const newCookie = [
        serialize("accessToken", accessToken, cookieConfig),
        serialize("refreshToken", refreshToken, cookieConfig),
        // serialize("foo", "bar", cookieConfig)
    ]

    res.setHeader("Set-Cookie", newCookie)

    res.status(200).json({ name: 'John Doe' })
}