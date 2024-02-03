import { NextResponse } from 'next/server';
import { decodeAccessToken } from '@/utils/validation/jwt';

 
// This function can be marked `async` if using `await` inside
export async function middleware(req) {
    // get the cookies 
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

      // verify if the expiration date is valid
      if (user.payload.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse
          .redirect(new URL("/unauthorized", req.nextUrl).toString());
      }
  
      // on per request basis, we will use the userId and/or email to get the user from the database
      // for now, we will just return the user payload
      req.user = user.payload;

      // return next response 
      let response = NextResponse.next({
        user: user.payload,
        headers: {
          'X-User-Payload': JSON.stringify(user.payload)
        }
      });
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