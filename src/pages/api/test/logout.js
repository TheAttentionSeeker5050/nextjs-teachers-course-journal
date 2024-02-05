import { serialize } from "cookie"
// import cookie config
import { cookieConfig } from "@/utils/validation/cookies";

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    // we need to update cookie to expire
    const newCookieConfig = cookieConfig;
    newCookieConfig.maxAge = -1;

    // const newCookie = serialize("foo", "bar", newCookieConfig)
    const newCookie = [
        serialize("accessToken", "", newCookieConfig),
        serialize("refreshToken", "", newCookieConfig),
    ]

    res.setHeader("Set-Cookie", newCookie)

    res.status(200).json({ name: 'John Doe' })
    // in the future we can redirect to the login page
}