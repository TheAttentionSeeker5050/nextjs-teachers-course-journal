// here we will add all the transactions related to the course model
// import the prisma client
// import prisma from "../prisma";
import prisma from "@/data/prisma";


// crud transactions for course
// create a course
const createCourse = async ({
    courseName,
    userId,
    hideCourse
}) => {

    // have hidden course as a boolean
    const hideCourseBool = hideCourse.toLowerCase() === 'true';

    const createdCourse = await prisma.course.create({
        data: {
            courseName: courseName,
            userId: userId,
            // parse to boolean
            isArchived: hideCourseBool
        }
    });

    // if the course is not created, we will throw an error
    if (!createdCourse) {
        throw new Error("There was a problem creating the course, please try again later");
    }

    return createdCourse;
}

// get all courses for users
const getCoursesByUserId = async (userId) => {

    // get all courses for the user
    const courses = await prisma.course.findMany({
        where: {
            userId: userId
        },
        // order by id ascending
        orderBy: {
            // dateCreated: 'asc'
            id: 'asc'
        }
    });

    // if the courses are not retrieved, we will throw an error
    if (!courses) {
        throw new Error("There was a problem retrieving the courses, please try again later");
    }

    return courses;
}

// get course by id
const getCourseById = async (id) => {

    try {
        // get the course by id
        const course = await prisma.course.findUnique({
            where: {
                id: id
            },
            // get course with also the number of children units in a field called unitsCount
            include: {
                _count: {
                    select: {
                        units: true
                    }
                }
            }
        });

        // if the course is not retrieved, we will throw an error
        if (!course) {
            throw new Error("There was a problem retrieving the course data, please try again later");
        }

        return course;

    } catch (error) {
        // console.error('Error getting course by id:', error);
        throw new Error("There was a problem updating the course data, please try again later");
    }
}

// get course by id, and all its children units, and all the children lessons of all the units
const getCourseByIdWithChildren = async (id) => {

    // get the course by id and order by the units and lessons number
    const course = await prisma.course.findUnique({
        where: {
            id: id
        },
        include: {
            units: {
                include: {
                    lessons: true
                },
                orderBy: {
                    unitNumber: 'asc'
                }
            }
        },

    });

    // if the course is not retrieved, we will throw an error
    if (!course) {
        throw new Error("There was a problem retrieving the course, please try again later");
    }

    return course;
}

const updateCourse = async ({
    id,
    newCourseName,
    hideCourse
}) => {

    // get the course by id
    const course = await getCourseById(id);

    // if the course is not retrieved, we will throw an error
    if (!course) {
        throw new Error("There was a problem retrieving the course, please try again later");
    }

    // have hidden course as a boolean
    const hideCourseBool = hideCourse.toLowerCase() === 'true';

    // update the course
    const updatedCourse = await prisma.course.update({
        where: {
            id: id
        },
        data: {
            courseName: newCourseName,
            isArchived: hideCourseBool
        }
    });

    // if the course is not updated, we will throw an error
    if (!updatedCourse) {
        throw new Error("There was a problem updating the course, please try again later");
    }

    return updatedCourse;
}

// update course thumbnail
const updateCourseThumbnail = async ({
    id,
    newThumbnail
}) => {

    // get the course by id
    const course = await getCourseById(id);

    // if the course is not retrieved, we will throw an error
    if (!course) {
        throw new Error("There was a problem retrieving the course, please try again later");
    }

    // update the course
    const updatedCourse = await prisma.course.update({
        where: {
            id: id
        },
        data: {
            thumbnail: newThumbnail
        }
    });

    // if the course is not updated, we will throw an error
    if (!updatedCourse) {
        throw new Error("There was a problem updating the course, please try again later");
    }

    return updatedCourse;
}

// delete course
const deleteCourse = async (id) => {

    // get the course by id
    const course = await getCourseById(id);

    // if the course is not retrieved, we will throw an error
    if (!course) {
        throw new Error("There was a problem retrieving the course, please try again later");
    }

    // delete the course
    const deletedCourse = await prisma.course.delete({
        where: {
            id: id
        }
    });

    // if the course is not deleted, we will throw an error
    if (!deletedCourse) {
        throw new Error("There was a problem deleting the course, please try again later");
    }

    return deletedCourse;
}

export {
    createCourse,
    getCoursesByUserId,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseByIdWithChildren,
    updateCourseThumbnail
}