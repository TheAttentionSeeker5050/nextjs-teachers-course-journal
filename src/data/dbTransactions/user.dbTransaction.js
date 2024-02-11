// here we will add all the transactions related to the user model
// import the prisma client
// const prisma = require("@/data/prisma");
import prisma from "@/data/prisma";


// create an user
const createUser = async ({
    email,
    password,
    firstName,
    lastName,
    title,
    organization,
}) => {

    // using the find user by id method, we will check if the user already exists
    const user = await getUserByEmail(email);

    // if the user exists, we will throw an error
    if (user) {
        throw new Error("User already exists");
    }

    // if the user does not exist, we will create a new user
    const createdUser = await prisma.user.create({
        data: 
        {
            email,
            password,
            firstName,
            lastName,
            title,
            organization,
        }
    });

    // if the user is not created, we will throw an error
    if (!createdUser) {
        throw new Error("There was a problem creating the user, please try again later");
    }

    return createdUser;
}

// update an user but just the fields that are not null
const updateUser = async ({
    id,
    email,
    firstName,
    lastName,
    title,
    organization,
}) => {

    // using the find user by id method, we will check if the user already exists
    const user = await getUserById(id);

    // if the user does not exist, we will throw an error
    if (!user) {
        throw new Error("User does not exists");
    }

    // if the user exists, we will update the user, but just the fields that are not null, and just the fields, email, dateUpdated, firstName, lastName, title and organization if any these fields is null, use the old values
    const updatedUser = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            email: email ? email : user.email,
            firstName: firstName ? firstName : user.firstName,
            lastName: lastName ? lastName : user.lastName,
            title: title ? title : user.title,
            organization: organization ? organization : user.organization,
            dateUpdated: new Date(),
        }
    });

    // if the user is not updated, we will throw an error
    if (!updatedUser) {
        throw new Error("There was a problem updating the user, please try again later");
    }

    return updatedUser;
}

// get a single user
const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
        id: id,
        }
    });


    // convert the date to iso string
    user.dateCreated = user.dateCreated.toISOString();
    user.dateUpdated = user.dateUpdated.toISOString();

    // remove the password from the user object
    return user;
}

// get user by email
const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
        email: email,
        },
    });
    return user;
}

// get just the hashed password with the email as a parameter
const getEncryptedPasswordByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
        email: email,
        },
        select: {
        password: true,
        },
    });

    return user.password;
}

// change ONLY encrypted password
// this will receive the new encrypted password and the email as a parameter
const changeEncryptedPasswordByEmail = async (email, newEncryptedPassword) => {

    // if user is not found, we will throw an error
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    const updatedUser = await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            password: newEncryptedPassword,
        },
    });

    // if the user is not updated, we will throw an error
    if (!updatedUser) {
        throw new Error("There was a problem updating the user, please try again later");
    }


    return user;
}

// delete an user
const deleteUser = async (id) => {

    // using the find user by id method, we will check if the user already exists
    const user = await getUserById(id);

    // if the user does not exist, we will throw an error
    if (!user) {
        throw new Error("User does not exists");
    }

    // if the user exists, we will delete the user
    const deletedUser = await prisma.user.delete({
        where: {
            id: id,
        }
    });

    // if the user is not deleted, we will throw an error
    if (!deletedUser) {
        throw new Error("There was a problem deleting the user, please try again later");
    }

    return deletedUser;
}

// export all the methods
module.exports = {
    createUser,
    updateUser,
    getUserById,
    getUserByEmail,
    getEncryptedPasswordByEmail,
    changeEncryptedPasswordByEmail,
    deleteUser,
}