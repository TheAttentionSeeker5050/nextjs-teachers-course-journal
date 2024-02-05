import '@testing-library/jest-dom'

import { createUser, getUserById, getUserByEmail, getEncryptedPasswordByEmail, changeEncryptedPasswordByEmail } from "@/data/dbTransactions/user.dbTransaction";
import { createCourse, getCoursesByUserId, getCourseById, updateCourse } from "@/data/dbTransactions/course.dbTransaction";
import { createUnit, getUnitById, getUnitsByCourseId, updateUnit, deleteUnit, updateUnitNumber } from "@/data/dbTransactions/unit.dbTransaction";

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
        const createdUnit = await createUnit({unitName: unitData.unitName, courseId: createdCourse.id});

        // get the unit by id
        const retrievedUnit = await getUnitById(createdUnit.id);

        // check if the unit is created
        expect(createdUnit).toBeDefined();

        // check if the unit is retrieved
        expect(retrievedUnit).toBeDefined();

        // expect the values to be the same
        expect(createdUnit.unitName).toEqual(retrievedUnit.unitName);
        expect(createdUnit.courseId).toEqual(retrievedUnit.courseId);
        
    })

    // test that will create a unit and update it
    test('Create and update a unit', async () => {
                
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // create a unit
        const createdUnit = await createUnit({unitName: unitData.unitName, courseId: createdCourse.id});

        // update the unit
        const updatedUnit = await updateUnit({id: createdUnit.id, newUnitName: "Charms"});

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
    })

    // test update unit number
    test('Update unit number: case 1, unit number changed upwards', async () => {
        // the expect unit numbers and names array
        const initialUnitNamesAndNumbers = [
            { unitNumber: 1, unitName: "Potions chapter 1"},
            { unitNumber: 2, unitName: "Potions chapter 2"},
            { unitNumber: 3, unitName: "Potions chapter 3"},
            { unitNumber: 4, unitName: "Potions chapter 4"},
            { unitNumber: 5, unitName: "Potions chapter 5"},
        ]

        const expectedUnitNamesAndNumbers = [
            { unitNumber: 1, unitName: "Potions chapter 1"},
            { unitNumber: 4, unitName: "Potions chapter 2"},
            { unitNumber: 2, unitName: "Potions chapter 3"},
            { unitNumber: 3, unitName: "Potions chapter 4"},
            { unitNumber: 5, unitName: "Potions chapter 5"},
        ]


        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // // create the units
        const createdUnit1 = await createUnit({unitName: initialUnitNamesAndNumbers[0].unitName, courseId: createdCourse.id});
        const createdUnit2 = await createUnit({unitName: initialUnitNamesAndNumbers[1].unitName, courseId: createdCourse.id});
        const createdUnit3 = await createUnit({unitName: initialUnitNamesAndNumbers[2].unitName, courseId: createdCourse.id});
        const createdUnit4 = await createUnit({unitName: initialUnitNamesAndNumbers[3].unitName, courseId: createdCourse.id});
        const createdUnit5 = await createUnit({unitName: initialUnitNamesAndNumbers[4].unitName, courseId: createdCourse.id});


        // update the unit number, unit number on lesson 2 is changed from 2 to 4
        const updatedUnit = await updateUnitNumber( createdCourse.id, createdUnit2.id, 4);

        // get the units by course id
        const retrievedUnits = await getUnitsByCourseId(createdCourse.id);

        // check if the units are created
        expect(createdUnit1).toBeDefined();

        // check if the units are retrieved
        expect(retrievedUnits).toBeDefined();        

        // loop through the expected unit names and numbers array
        expectedUnitNamesAndNumbers.forEach(expectedUnit => {
            // find the unit number of the expected unit name
            const retrievedUnitNumber = retrievedUnits.find(unit => unit.unitName === expectedUnit.unitName).unitNumber;

            // expect the retrieved unit number to be the same as the expected unit number
            expect(retrievedUnitNumber).toEqual(expectedUnit.unitNumber);
        })
    })

    // test update unit number
    test('Update unit number: case 2, unit number changed downwards', async () => {
        // the expect unit numbers and names array
        const initialUnitNamesAndNumbers = [
            { unitNumber: 1, unitName: "Potions chapter 1"},
            { unitNumber: 2, unitName: "Potions chapter 2"},
            { unitNumber: 3, unitName: "Potions chapter 3"},
            { unitNumber: 4, unitName: "Potions chapter 4"},
            { unitNumber: 5, unitName: "Potions chapter 5"},
        ]

        const expectedUnitNamesAndNumbers = [
            { unitNumber: 1, unitName: "Potions chapter 1"},
            { unitNumber: 3, unitName: "Potions chapter 2"},
            { unitNumber: 4, unitName: "Potions chapter 3"},
            { unitNumber: 2, unitName: "Potions chapter 4"},
            { unitNumber: 5, unitName: "Potions chapter 5"},
        ]


        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // // create the units
        const createdUnit1 = await createUnit({unitName: initialUnitNamesAndNumbers[0].unitName, courseId: createdCourse.id});
        const createdUnit2 = await createUnit({unitName: initialUnitNamesAndNumbers[1].unitName, courseId: createdCourse.id});
        const createdUnit3 = await createUnit({unitName: initialUnitNamesAndNumbers[2].unitName, courseId: createdCourse.id});
        const createdUnit4 = await createUnit({unitName: initialUnitNamesAndNumbers[3].unitName, courseId: createdCourse.id});
        const createdUnit5 = await createUnit({unitName: initialUnitNamesAndNumbers[4].unitName, courseId: createdCourse.id});


        // update the unit number, unit number on lesson 2 is changed from 2 to 4
        const updatedUnit = await updateUnitNumber( createdCourse.id, createdUnit4.id, 2);

        // get the units by course id
        const retrievedUnits = await getUnitsByCourseId(createdCourse.id);

        // check if the units are created
        expect(createdUnit1).toBeDefined();

        // check if the units are retrieved
        expect(retrievedUnits).toBeDefined();     
        
        // console.log(retrievedUnits);

        // loop through the expected unit names and numbers array
        expectedUnitNamesAndNumbers.forEach(expectedUnit => {
            // find the unit number of the expected unit name
            const retrievedUnitNumber = retrievedUnits.find(unit => unit.unitName === expectedUnit.unitName).unitNumber;

            // console.log(retrievedUnitNumber, 
            //     expectedUnit.unitNumber,
            //     expectedUnit.unitName
            // );

            // expect the retrieved unit number to be the same as the expected unit number
            expect(retrievedUnitNumber).toEqual(expectedUnit.unitNumber);
        })
    })
})