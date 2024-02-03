import jwt from 'jsonwebtoken';


import * as jose from 'jose'


// this will store the json web token handler functions

// a create generic token function, this Is for the access token and the refresh token
// it receives params: request, response, payload, secret, and expiration
// returns a token
export function createToken(req, res, payload, secret, expiration) {
    // create the expiration string, this will be passed to the jwt.sign function
    // in the format of "30m", "1h", "7d", etc.
    let expirationStr = "30m"

    // if not a valid expiration, do not change the expirationStr
    if (expiration === undefined || typeof expiration !== Number || expiration <=0 );
    // else change to the correct expiration format
    else if (expiration < 1 ) {
        // convert from hours to minutes, round up
        expirationStr = `${Math.ceil(expiration * 60)}m`;
    } else {
        // round up to hours
        expirationStr = `${Math.ceil(expiration)}h`;
    }

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
export function createAccessToken(req, res, payload) {
    const token = createToken(req, res, payload, process.env.JWT_SECRET, process.env.JWT_ACCESS_TOKEN_EXPIRATION_HOURS);

    return token;
}

// a create refresh token function
export function createRefreshToken(req, res, payload) {
    const token = createToken(req, res, payload, process.env.JWT_SECRET, process.env.JWT_REFRSH_TOKEN_EXPIRATION_HOURS);

    return token;
}

// a decode access token function
export async function decodeAccessToken(token) {
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


// a revoke access and refresh token function