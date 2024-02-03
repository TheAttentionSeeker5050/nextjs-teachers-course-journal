import { NextResponse } from 'next/server';
import { decodeAccessToken } from '@/utils/validation/jwt';

 
// This function can be marked `async` if using `await` inside
export async function middleware(req, res, next) {
    // get the cookies foo=bar
    let accessToken = req.cookies.get("accessToken");
    let refreshToken = req.cookies.get("refreshToken");

    // if no content is found, return a unauthorized response
    if (!accessToken || !refreshToken) {
        return NextResponse.redirect(new URL("/unauthorized", req.nextUrl).toString());
    }
    

    try {
      // decode the access token
      const user = await decodeAccessToken(accessToken['value']);
      // console.log('user', user.payload);
  
      req.user = user;
      
      // return next response 
      let response = NextResponse.next();
      return response;
      
    } catch (error) {
      console.log('error: ', error.message);
      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl).toString());
    }
    
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/profile',]
}