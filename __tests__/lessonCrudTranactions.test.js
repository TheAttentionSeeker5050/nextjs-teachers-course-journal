// import the lessonCrudTransactions file
import { 
    createLessonForUnit, 
    getLessonsForUnit, 
    getLessonById, 
    updateLesson, 
    deleteLessonById, 
    changeLessonNumber 
} from "../src/data/dbTransactions/lesson.dbTransaction";

// import other crud transactions

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

const lessonData = {
    lessonName: "Potions 101",
    lessonNumber: 1,
    completionStatus: "prepped",
}

// test create and retrieve lesson, you have to create a course, unit and user first
describe("Lesson CRUD Transactions", () => {
    // test create and retrieve lesson, you have to create a course, unit and user first
    test('Create and retrieve a lesson', async () => {
            
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // create a unit
        const createdUnit = await createUnit({unitName: unitData.unitName, unitNumber: unitData.unitNumber, courseId: createdCourse.id});

        // create a lesson
        const createdLesson = await createLessonForUnit({lessonName: lessonData.lessonName, lessonNumber: lessonData.lessonNumber, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});

        // get the lesson by id
        const retrievedLesson = await getLessonById(createdLesson.id);

        // check if the lesson is created
        expect(createdLesson).toBeDefined();

        // check if the lesson is retrieved
        expect(retrievedLesson).toBeDefined();

        // expect the values to be the same
        expect(createdLesson.lessonName).toEqual(retrievedLesson.lessonName);
        expect(createdLesson.unitId).toEqual(retrievedLesson.unitId);
    })
        
    // test update lesson, you have to create a course, unit and user first
    test('Update a lesson', async () => {

        const updatedLessonData = {
            lessonName: "Potions 102",
            completionStatus: "completed",
        }
            
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});
        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});
        // create a unit
        const createdUnit = await createUnit({unitName: unitData.unitName, unitNumber: unitData.unitNumber, courseId: createdCourse.id});
        // create a lesson
        const createdLesson = await createLessonForUnit({lessonName: lessonData.lessonName, lessonNumber: lessonData.lessonNumber, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});
        // update the lesson
        const updatedLesson = await updateLesson({id: createdLesson.id, lessonName: updatedLessonData.lessonName, completionStatus: updatedLessonData.completionStatus});
        // get the lesson by id
        const retrievedLesson = await getLessonById(createdLesson.id);
        // check if the lesson is updated
        expect(updatedLesson).toBeDefined();
        // check if the lesson is retrieved
        expect(retrievedLesson).toBeDefined();
        // expect the values to be the same
        expect(updatedLesson.lessonName).toEqual(retrievedLesson.lessonName);
        // expect the values to be the same
        expect(updatedLesson.completionStatus).toEqual(retrievedLesson.completionStatus);
    })

    // test delete lesson, you have to create a course, unit and user first
    test('Delete a lesson', async () => {
            
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});
        
        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});
        
        // create a unit
        const createdUnit = await createUnit({unitName: unitData.unitName, unitNumber: unitData.unitNumber, courseId: createdCourse.id});
        
        // create a lesson
        const createdLesson = await createLessonForUnit({lessonName: lessonData.lessonName, lessonNumber: lessonData.lessonNumber, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});
        
        // delete the lesson
        const deletedLesson = await deleteLessonById(createdLesson.id);
        
        // attempt to get the lesson by id and expect an error to be thrown
        expect(getLessonById(createdLesson.id)).rejects.toThrow(); 
        
        // check if the lesson is deleted
        expect(deletedLesson).toBeDefined();
        
    })

    // test shift lesson number, you have to create a course, unit and user first
    test('Shift lesson number: case 1 - lesson number is changed upwards', async () => {
                
        // expected lesson number and lesson name array
        const expectedResultsArray = [
            {lessonNumber: 1, lessonName: "potions 101"},
            {lessonNumber: 4, lessonName: "potions 102"},
            {lessonNumber: 2, lessonName: "potions 103"},
            {lessonNumber: 3, lessonName: "potions 104"},
            {lessonNumber: 5, lessonName: "potions 105"},
        ];

        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // create a unit
        const createdUnit = await createUnit({unitName: unitData.unitName, unitNumber: unitData.unitNumber, courseId: createdCourse.id});

        // create a lesson
        const createdLesson1 = await createLessonForUnit({lessonName: "potions 101", lessonNumber: 1, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});

        // create a lesson
        const createdLesson2 = await createLessonForUnit({lessonName: "potions 102", lessonNumber: 2, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});
        
        // create a lesson
        const createdLesson3 = await createLessonForUnit({lessonName: "potions 103", lessonNumber: 3, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});
        // create a lesson
        const createdLesson4 = await createLessonForUnit({lessonName: "potions 104", lessonNumber: 4, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});
        
        // create a lesson
        const createdLesson5 = await createLessonForUnit({lessonName: "potions 105", lessonNumber: 5, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});
        try {

        
        // shift the lesson number
            const shiftedLesson = await changeLessonNumber(createdUnit.id, createdLesson2.id, 4);

            // test and compare the results
            expect(shiftedLesson).toBeDefined();

            // find the lesson number by lesson name
            const lessonNumber1 = shiftedLesson.find(lesson => lesson.lessonName === "potions 101").lessonNumber;
            const lessonNumber2 = shiftedLesson.find(lesson => lesson.lessonName === "potions 102").lessonNumber;
            const lessonNumber3 = shiftedLesson.find(lesson => lesson.lessonName === "potions 103").lessonNumber;
            const lessonNumber4 = shiftedLesson.find(lesson => lesson.lessonName === "potions 104").lessonNumber;
            const lessonNumber5 = shiftedLesson.find(lesson => lesson.lessonName === "potions 105").lessonNumber;

            // compare the results with array of expected results
            expect(lessonNumber1).toEqual(expectedResultsArray[0].lessonNumber);
            expect(lessonNumber2).toEqual(expectedResultsArray[1].lessonNumber);
            expect(lessonNumber3).toEqual(expectedResultsArray[2].lessonNumber);
            expect(lessonNumber4).toEqual(expectedResultsArray[3].lessonNumber);
            expect(lessonNumber5).toEqual(expectedResultsArray[4].lessonNumber);
        } catch (error) {
            // expect the error to not be thrown
            expect(error).toBeUndefined();
        }
    })


    // test shift lesson number, you have to create a course, unit and user first
    test('Shift lesson number: case 2 - lesson number is changed downwards', async () => {
         

        // expected lesson number and lesson name array
        const expectedResultsArray = [
            {lessonNumber: 1, lessonName: "potions 101"},
            {lessonNumber: 3, lessonName: "potions 102"},
            {lessonNumber: 4, lessonName: "potions 103"},
            {lessonNumber: 2, lessonName: "potions 104"},
            {lessonNumber: 5, lessonName: "potions 105"},
        ];

        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // create a unit
        const createdUnit = await createUnit({unitName: unitData.unitName, unitNumber: unitData.unitNumber, courseId: createdCourse.id});

        // create a lesson
        const createdLesson1 = await createLessonForUnit({lessonName: "potions 101", lessonNumber: 1, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});

        // create a lesson
        const createdLesson2 = await createLessonForUnit({lessonName: "potions 102", lessonNumber: 2, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});
        
        // create a lesson
        const createdLesson3 = await createLessonForUnit({lessonName: "potions 103", lessonNumber: 3, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});
        // create a lesson
        const createdLesson4 = await createLessonForUnit({lessonName: "potions 104", lessonNumber: 4, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});
        
        // create a lesson
        const createdLesson5 = await createLessonForUnit({lessonName: "potions 105", lessonNumber: 5, completionStatus: lessonData.completionStatus, unitId: createdUnit.id});

        try {
            // shift the lesson number
            const shiftedLesson = await changeLessonNumber(createdUnit.id, createdLesson4.id, 2);
            
            // test and compare the results
            expect(shiftedLesson).toBeDefined();
    
            // find the lesson number by lesson name
            const lessonNumber1 = shiftedLesson.find(lesson => lesson.lessonName === "potions 101").lessonNumber;
            const lessonNumber2 = shiftedLesson.find(lesson => lesson.lessonName === "potions 102").lessonNumber;
            const lessonNumber3 = shiftedLesson.find(lesson => lesson.lessonName === "potions 103").lessonNumber;
            const lessonNumber4 = shiftedLesson.find(lesson => lesson.lessonName === "potions 104").lessonNumber;
            const lessonNumber5 = shiftedLesson.find(lesson => lesson.lessonName === "potions 105").lessonNumber;
    
            // compare the results with array of expected results
            expect(lessonNumber1).toEqual(expectedResultsArray[0].lessonNumber);
            expect(lessonNumber2).toEqual(expectedResultsArray[1].lessonNumber);
            expect(lessonNumber3).toEqual(expectedResultsArray[2].lessonNumber);
            expect(lessonNumber4).toEqual(expectedResultsArray[3].lessonNumber);
            expect(lessonNumber5).toEqual(expectedResultsArray[4].lessonNumber);

        } catch (error) {
            // expect the error to not be thrown
            expect(error).toBeUndefined();
        }

    })

})
