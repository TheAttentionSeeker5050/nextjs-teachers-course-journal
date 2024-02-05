import { describe, expect, test } from "@jest/globals";

import { createAccessToken, createRefreshToken, decodeToken, refreshAccessToken } from "@/utils/validation/jwt";

// import jsonwebtoken
import jwt from 'jsonwebtoken';

// the user data
const userData = {
    userId: 1,
    email: "john.doe@gmail.com",
}

// the json web token payload data, 
// user id, email, and expiration

describe('JWT', () => {
    // // make a dummy test true equal true
    // test('it should return true', () => {
    //     expect(true).toEqual(true);
    // });

    // test create and decode access token
    test('it should return a decoded access token', async () => {
        // create the access token
        const accessToken = createAccessToken(userData);

        // decode the access token
        const decoded = await decodeToken(accessToken);

        // check if the decoded token id and email is the same as the user data
        expect(decoded.payload.userId).toEqual(userData.userId);
        expect(decoded.payload.email).toEqual(userData.email);
    });

    // create an access and refresh token, refresh the access token using the refresh token function
    // which receives the refresh token and returns [new access token, new refresh token]
    // then decode the new access token and verify if the user data is the same as the user data
    test('it should return a new access token', async () => {
        // create the access token and refresh token
        // const accessToken = createAccessToken(userData);
        const refreshToken = await createRefreshToken(userData);

        try {
            // refresh the access token
            const [newAccessToken, newRefreshToken] = await refreshAccessToken(refreshToken);

            // console.log("newAccessToken:", newAccessToken, "\nnewRefreshToken:", newRefreshToken);
            
            // if no access or refresh token is returned, throw an error
            if (newAccessToken === undefined || newAccessToken === null || newAccessToken === "" || typeof newAccessToken !== "string") {
                throw new Error('Invalid access token format');
            }

            // decode the new access token
            const decoded = (await decodeToken(newAccessToken)).payload;


            // check if the decoded token id and email is the same as the user data
            expect(decoded.payload.userId).toEqual(userData.userId);
            expect(decoded.payload.email).toEqual(userData.email);

        } catch (error) {
            // expect no error
            expect(error).toBeUndefined();
        }
    });

});