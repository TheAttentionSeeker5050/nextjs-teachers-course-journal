import { describe, expect, test } from "@jest/globals";

// import the jwt functions
import { createToken, createAccessToken, createRefreshToken, decodeToken } from "@/utils/validation/jwt";

// the json web token payload data, 
// user id, email, and expiration

describe('JWT', () => {
    // make a dummy test true equal true
    test('it should return true', () => {
        expect(true).toEqual(true);
    });

});