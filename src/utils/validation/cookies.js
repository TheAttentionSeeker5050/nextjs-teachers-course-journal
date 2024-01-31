import { parse, serialize } from 'cookie';
import { setCookie } from 'cookies-next';


// this is no longer used, still we will leave it as is
export const getCookieHandler = (req, res, key) => {
    if (typeof key != "string") {
        return null;
    } else {


        const cookies = parse(req.headers.cookie || "");
        const token = cookies[key];
        return token;
    }
}


export const setCookieHandler = (req, res, key, value) => {
    const maxCookiesHours = Number(process.env.COOKIE_AGE_HOURS);
    const cookiesAreSecure = process.env.NODE_ENV === 'production';

    const cookieOptions = {
        req,
        res,
        maxAge: maxCookiesHours * 3600,
        path: "/",
        secure: cookiesAreSecure,
        sameSite: "lax"
    }
    setCookie(key, value, cookieOptions)
    return;
}
