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
})