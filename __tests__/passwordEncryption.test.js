// the file name should be the same as the file you want to test with .test.js at the end
import { describe, expect, test } from "@jest/globals";

// import the hash password function
import { hashPassword, comparePassword } from "@/utils/validation/passwordEncryption";

// make the password data
const passwordData = {
    password: "password",
    saltRounds: 10,
    hashedPassword: "$2b$10$8e1/lbRQRtnKjDj2pnHWKeDI3V8e5E/iEM2WKAq42ShqKiYGidP1." // change this to the hashed password
}

// test the password encryption
describe('Password Encryption', () => {
    test('it should return a hashed password', async () => {
        const hashedPassword = await hashPassword(passwordData.password, passwordData.saltRounds);
        // expect(hashedPassword).toEqual(passwordData.hashedPassword);

        // because the hashed password is different every time, we cannot compare it to the hashed password
        // so we will just check if the hashed password is a string and compare it to the password 
        // using the compare function
        expect(typeof hashedPassword).toEqual('string');

        // compare the password
        const result = await comparePassword(passwordData.password, hashedPassword);

    });

    // for invalid password
    test('it should return an error for invalid password', async () => {
        const hashedPassword = await hashPassword(passwordData.password, passwordData.saltRounds);
        // expect(hashedPassword).toEqual(passwordData.hashedPassword);

        // because the hashed password is different every time, we cannot compare it to the hashed password
        // so we will just check if the hashed password is a string and compare it to the password 
        // using the compare function
        expect(typeof hashedPassword).toEqual('string');

        // compare the password
        const result = await comparePassword('invalidpassword', hashedPassword);
        expect(result).toEqual(false);

    });
});