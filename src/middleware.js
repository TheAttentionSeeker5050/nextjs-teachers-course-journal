import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    // get the cookies foo=bar
    let accessToken = request.cookies.get("accessToken");
    let refreshToken = request.cookies.get("refreshToken");

    // if no content is found, return a unauthorized response
    if (!accessToken || !refreshToken) {
        return NextResponse.redirect(new URL("/unauthorized", request.nextUrl).toString());
    }
    
    // return next response 
    let response = NextResponse.next();
    return response;
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/profile',]
}