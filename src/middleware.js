import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    // get the cookies foo=bar
    let bar = request.cookies.get("foo");

    // if no content is found, return a unauthorized response
    if (!bar) {
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