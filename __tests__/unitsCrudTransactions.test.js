import '@testing-library/jest-dom'

import { createUser, getUserById, getUserByEmail, getEncryptedPasswordByEmail, changeEncryptedPasswordByEmail } from "@/data/dbTransactions/user.dbTransaction";
import { createCourse, getCoursesByUserId, getCourseById, updateCourse } from "@/data/dbTransactions/course.dbTransaction";
import { createUnit, getUnitById, getUnitsByCourseId, updateUnit, deleteUnit } from "@/data/dbTransactions/unit.dbTransaction";

// import the testing suite
import { describe, expect, test } from "@jest/globals";

import Prisma from "@/data/prisma";


// the test data
const userData = {
    email: "severus@hogwards.com",
    password: "password",
    firstName: "Severous",
    lastName: "Snape",
    title: "Professor",
    organization: "Hogwarts",
}


const courseData = {
    courseName: "Defense against the dark arts",
}

const unitData = {
    unitName: "Potions",
    unitNumber: 1,
}


// create a test that will test if true is equal to true
describe("Unit CRUD Transactions", () => {
    // test create and retrieve unit, you have to create a course and user first
    test('Create and retrieve a unit', async () => {
            
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // create a unit
        const createdUnit = await createUnit({unitName: unitData.unitName, unitNumber: unitData.unitNumber, courseId: createdCourse.id});

        // get the unit by id
        const retrievedUnit = await getUnitById(createdUnit.id);

        // check if the unit is created
        expect(createdUnit).toBeDefined();

        // check if the unit is retrieved
        expect(retrievedUnit).toBeDefined();

        // expect the values to be the same
        expect(createdUnit.unitName).toEqual(retrievedUnit.unitName);
        expect(createdUnit.courseId).toEqual(retrievedUnit.courseId);
        

        // // delete the unit
        // await Prisma.unit.delete({
        //     where: {
        //         id: createdUnit.id
        //     }
        // })

        // // delete the course
        // await Prisma.course.delete({
        //     where: {
        //         id: createdCourse.id
        //     }
        // })

        // // delete the user
        // await Prisma.user.delete({
        //     where: {
        //         id: createdUser.id
        //     }
        // })
    })

    // test that will create a unit and update it
    test('Create and update a unit', async () => {
                
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // create a unit
        const createdUnit = await createUnit({unitName: unitData.unitName, unitNumber: unitData.unitNumber, courseId: createdCourse.id});

        // update the unit
        const updatedUnit = await updateUnit({id: createdUnit.id, newUnitName: "Charms", newUnitNumber: 2});

        // get the unit by id
        const retrievedUnit = await getUnitById(createdUnit.id);

        // check if the unit is created
        expect(createdUnit).toBeDefined();

        // check if the unit is retrieved
        expect(retrievedUnit).toBeDefined();

        // expect the values to be the same
        expect(updatedUnit.unitName).toEqual(retrievedUnit.unitName);
        expect(updatedUnit.courseId).toEqual(retrievedUnit.courseId);
        

        // delete the unit
        await Prisma.unit.delete({
            where: {
                id: createdUnit.id
            }
        })

        // // delete the course
        // await Prisma.course.delete({
        //     where: {
        //         id: createdCourse.id
        //     }
        // })

        // // delete the user
        // await Prisma.user.delete({
        //     where: {
        //         id: createdUser.id
        //     }
        // })
    })
})