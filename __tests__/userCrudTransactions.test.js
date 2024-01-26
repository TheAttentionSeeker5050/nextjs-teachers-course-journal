// this test will test crud db transactions for user 
// import all the methods from the user crud transactions, these already have the prisma client
import { createUser, getUserById, getUserByEmail, getEncryptedPasswordByEmail, changeEncryptedPasswordByEmail } from "@/data/dbTransactions/user.dbTransaction";

// import the testing suite
import { describe, expect, test } from "@jest/globals";
import '@testing-library/jest-dom'

import Prisma from "@/data/prisma";



// the test data
const userData = {
    email: "user@email.com",
    password: "password",
    firstName: "firstName",
    lastName: "lastName",
    title: "title",
    organization: "organization",
}

// test the creation and retrieval of an user
describe("User CRUD Transactions", () => {
    test('Create and retrieve an user', async () => {

        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // get the user by id
        const retrievedUser = await getUserById(createdUser.id);

        // check if the user is created
        expect(createdUser).toBeDefined();

        // check if the user is retrieved
        expect(retrievedUser).toBeDefined();

        // expect the values to be the same
        expect(createdUser.email).toEqual(retrievedUser.email);
        expect(createdUser.firstName).toEqual(retrievedUser.firstName);
        expect(createdUser.lastName).toEqual(retrievedUser.lastName);
        expect(createdUser.title).toEqual(retrievedUser.title);
        expect(createdUser.organization).toEqual(retrievedUser.organization);
        


        // delete the user
        await Prisma.user.delete({
            where: {
                id: createdUser.id
            }
        })
    })

    // test the retrieval of an user by email
    test('Retrieve an user by email', async () => {
            
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // get the user by email
        const retrievedUser = await getUserByEmail(createdUser.email);

        // check if the user is created
        expect(createdUser).toBeDefined();

        // check if the user is retrieved
        expect(retrievedUser).toBeDefined();

        // expect the values to be the same
        expect(createdUser.email).toEqual(retrievedUser.email);
        expect(createdUser.firstName).toEqual(retrievedUser.firstName);
        expect(createdUser.lastName).toEqual(retrievedUser.lastName);
        expect(createdUser.title).toEqual(retrievedUser.title);
        expect(createdUser.organization).toEqual(retrievedUser.organization);

        // test the dates
        expect(createdUser.createdAt).toEqual(retrievedUser.createdAt);
        expect(createdUser.updatedAt).toEqual(retrievedUser.updatedAt);        

        // delete the user
        await Prisma.user.delete({
            where: {
                id: createdUser.id
            }
        })
    })

    // test creation and update of user password
    test("Create retrieve and update user password", async () => {
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // get the user by email
        const retrievedUser = await getUserByEmail(createdUser.email);

        // check if the user is created
        expect(createdUser).toBeDefined();

        // check if the user is retrieved
        expect(retrievedUser).toBeDefined();

        // change the password
        const newPassword = "newPassword";
        await changeEncryptedPasswordByEmail(createdUser.email, newPassword);

        // retrieve the new password
        const retrievedPassword = await getEncryptedPasswordByEmail(createdUser.email);

        // check if the password is changed
        expect(retrievedPassword).toBeDefined();

        // check if the password is the same
        expect(retrievedPassword).toEqual(newPassword);

        // delete the user
        await Prisma.user.delete({
            where: {
                id: createdUser.id
            }
        })
    })

    // change password on a user that doesnt exist
    test("Change password on a user that doesnt exist", async () => {
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // get the user by email
        const retrievedUser = await getUserByEmail(createdUser.email);

        // check if the user is created
        expect(createdUser).toBeDefined();

        // check if the user is retrieved
        expect(retrievedUser).toBeDefined();

        try {
            
            // change the password
            const newPassword = "newPassword";
            await changeEncryptedPasswordByEmail("notRealEmail@gmail.com", newPassword);
        } catch (error) {
            // check if the error is thrown
            expect(error).toBeDefined();
        }

        // delete the user
        await Prisma.user.delete({
            where: {
                id: createdUser.id
            }
        })
        
    })
})
