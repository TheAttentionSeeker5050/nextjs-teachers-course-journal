
// get number of hours from env
const cookieMaxAge = process.env.COOKIE_AGE_HOURS || 24;

// export  cookie config
export const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    // sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * cookieMaxAge, 
}