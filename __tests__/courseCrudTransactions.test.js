// this test will test crud db transactions for course 
// import all the methods from the course crud transactions, these already have the prisma client
import { createCourse, getCoursesByUserId, getCourseById, updateCourse, deleteCourse } from "@/data/dbTransactions/course.dbTransaction";
import { createUser, getUserByEmail, getUserById } from "@/data/dbTransactions/user.dbTransaction";



// import the testing suite
import { describe, expect, test } from "@jest/globals";
import '@testing-library/jest-dom'

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

beforeAll(async () => {
    // delete all the users, courses, and units
    await Prisma.user.deleteMany();
    await Prisma.course.deleteMany();
    await Prisma.unit.deleteMany();
})


// test the courses
describe("Course CRUD Transactions", () => {
    // test the creation and retrieval of a course
    test('Create and retrieve a course', async () => {

        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // get the course by id
        const retrievedCourse = await getCourseById(createdCourse.id);

        // check if the course is created
        expect(createdCourse).toBeDefined();

        // check if the course is retrieved
        expect(retrievedCourse).toBeDefined();

        // expect the values to be the same
        expect(createdCourse.courseName).toEqual(retrievedCourse.courseName);
        expect(createdCourse.userId).toEqual(retrievedCourse.userId);
        

        // delete the course
        await Prisma.course.delete({
            where: {
                id: createdCourse.id
            }
        })

        // delete the user
        await Prisma.user.delete({
            where: {
                id: createdUser.id
            }
        })
    })


    // test the retrieval of courses by user id
    test('Retrieve courses by user id', async () => {
            
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse1 = await createCourse({courseName: courseData.courseName, userId: createdUser.id});
        const createdCourse2 = await createCourse({courseName: courseData.courseName, userId: createdUser.id});
        const createdCourse3 = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // get the courses by user id
        const retrievedCourses = await getCoursesByUserId(createdUser.id);

        // check if the course is created
        expect(createdCourse1).toBeDefined();
        expect(createdCourse2).toBeDefined();
        expect(createdCourse3).toBeDefined();

        // check if the course is retrieved
        expect(retrievedCourses).toBeDefined();
        
        // test the length of the retrieved courses
        expect(retrievedCourses.length).toEqual(3);

        // test the course name values of the retrieved courses
        expect(retrievedCourses[0].courseName).toEqual(createdCourse1.courseName);
        expect(retrievedCourses[1].courseName).toEqual(createdCourse2.courseName);
        expect(retrievedCourses[2].courseName).toEqual(createdCourse3.courseName);
        

        // delete all the courses
        await Prisma.course.deleteMany({
            where: {
                userId: createdUser.id
            }
        });

        // delete the user
        await Prisma.user.delete({
            where: {
                id: createdUser.id
            }
        });
    })

    // test the update of a course
    test('Update a course', async () => {
            
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // update the course
        const updatedCourse = await updateCourse({id: createdCourse.id, courseName: "Potions", userId: createdUser.id});

        // get the course by id
        const retrievedCourse = await getCourseById(createdCourse.id);

        // check if the course is created
        expect(createdCourse).toBeDefined();

        // check if the course is retrieved
        expect(retrievedCourse).toBeDefined();

        // expect the values to be the same
        expect(updatedCourse.courseName).toEqual(retrievedCourse.courseName);
        expect(updatedCourse.userId).toEqual(retrievedCourse.userId);
        

        // delete the course
        await Prisma.course.delete({
            where: {
                id: retrievedCourse.id
            }
        })

        // delete the user
        await Prisma.user.delete({
            where: {
                id: createdUser.id
            }
        })
    })

    // test cascade delete of a course (user is deleted too)
    test('Delete a course', async () => {
                
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // delete the course
        await Prisma.course.delete({
            where: {
                id: createdCourse.id
            }
        })

        try {
            // get the course by id
            const retrievedCourse = await getCourseById(createdCourse.id);
        } catch (error) {
            expect(error).toBeDefined();
        }

        // check if the course is created
        expect(createdCourse).toBeDefined();

        // delete the user
        await Prisma.user.delete({
            where: {
                id: createdUser.id
            }
        })
    })

    // cascade delete of a user (course is deleted too)
    test('Delete a user/cascade course', async () => {
                    
        // create an user
        const createdUser = await createUser({email: userData.email, password: userData.password, firstName: userData.firstName, lastName: userData.lastName, title: userData.title, organization: userData.organization});

        // create a course
        const createdCourse = await createCourse({courseName: courseData.courseName, userId: createdUser.id});

        // delete the user
        await Prisma.user.delete({
            where: {
                id: createdUser.id
            }
        })

        try {
            // get the course by id
            const retrievedCourse = await getCourseById(createdCourse.id);
        } catch (error) {
            expect(error).toBeDefined();
        }

        // check if the course is created
        expect(createdCourse).toBeDefined();

        // delete the course
        await Prisma.course.deleteMany({});
    })   


})