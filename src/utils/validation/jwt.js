import jwt from 'jsonwebtoken';


import * as jose from 'jose'


// this will store the json web token handler functions

// a create generic token function, this Is for the access token and the refresh token
// it receives params: request, response, payload, secret, and expiration
// returns a token
export function createToken(payload, secret, expiration) {
    
    // create an exp value
    const exp = Math.floor(Date.now() / 1000) + expiration * 60 * 60;

    // create the token
    const token = jwt.sign({
        ...payload,
        exp
    }, secret);


    // return the token
    return token;
}


// a create access token function
export function createAccessToken(payload) {
    const token = createToken(payload, process.env.JWT_SECRET, process.env.JWT_ACCESS_TOKEN_EXPIRATION_HOURS);

    return token;
}

// a create refresh token function
export function createRefreshToken(payload) {
    const token = createToken(payload, process.env.JWT_SECRET, process.env.JWT_REFRSH_TOKEN_EXPIRATION_HOURS);

    return token;
}

// a decode access token function
export async function decodeToken(token) {
    try {
        if (token === undefined || token === null || token === "" || typeof token !== "string") {
            throw new Error('Invalid token format');
        }

        // decode the token using jose
        const decoded = await jose.jwtVerify(
            token, 
            new TextEncoder().encode(process.env.JWT_SECRET),
        );

        return decoded;

    } catch (error) {
        throw new Error(error);
    
    }

}

// a refresh access token function
// this function receives the refresh token and returns a new access token and refresh token
// with the same payload and the remaining expiration time
export async function refreshAccessToken(refreshToken) {
    try {
        // decode the refresh token
        const decoded = await decodeToken(refreshToken);

        // verify if the token has expired
        if (decoded.exp < Date.now()) {
            throw new Error('Token has expired');
        }

        // create a new access token
        const newAccessToken = createAccessToken(decoded);

        // create a new refresh token
        const newRefreshToken = createRefreshToken(decoded);

        // return the new access token and refresh token
        return [
            newAccessToken,
            newRefreshToken
        ];

    } catch (error) {
        throw new Error(error);
    }
}

// no need for a revoke token function, the refresh and access tokens will 
// be deleted when the user logs out. This is stateless token authentication