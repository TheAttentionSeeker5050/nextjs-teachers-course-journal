// here we will add all the transactions related to the lesson model
// an unit has many lessons
// import the prisma client
import prisma from "../prisma";

// lesson columns
// id
// lessonName
// lessonNumber
// unitId
// comletionStatus
// epectedOutcomes
// assessment



// create a lesson for unit
const createLessonForUnit = async ({
    unitId,
    lessonName,
    completionStatus,
    expectedOutcomes,
    assessment
}) => {
    console.log("unitId", unitId);
    console.log("typeof unitId", typeof unitId);
    // we want to make sure the lesson number is unique for the unit
    // and that it is the last lesson number for the unit when we insert it
    const lessons = await getLessonsForUnit(unitId);
    const lessonNumber = lessons.length + 1;

    // add the lesson to the database
    const createdLesson = await prisma.lesson.create({
        data: {
            unitId: unitId,
            lessonName: lessonName,
            lessonNumber: lessonNumber,
            completionStatus: completionStatus,
            expectedOutcomes: expectedOutcomes,
            assessment: assessment
        }
    });


    // if the lesson is not created, we will throw an error
    if (!createdLesson) {
        throw new Error("There was a problem creating the lesson, please try again later");
    }

    return createdLesson;
}

// get all lessons for unit
const getLessonsForUnit = async (unitId) => {
    // console.log("unitId", unitId);
    // console.log("typeof unitId", typeof unitId);
    // get all lessons for the unit, in order of lesson number ascending
    const lessons = await prisma.lesson.findMany({
        where: {
            unitId: unitId
        },
        orderBy: {
            lessonNumber: "asc"
        }

    });

    // if the lessons are not retrieved, we will throw an error
    if (!lessons) {
        throw new Error("There was a problem retrieving the lessons, please try again later");
    }

    return lessons;
}


// get a single lesson by id
const getLessonById = async (id) => {

    // get the lesson by id
    const lesson = await prisma.lesson.findUnique({
        where: {
            id: id
        }
    });

    // if the lesson is not retrieved, we will throw an error
    if (!lesson) {
        throw new Error("There was a problem retrieving the lesson, please try again later");
    }

    return lesson;
}

// update a lesson by lesson id
const updateLesson = async ({
    id,
    lessonName,
    completionStatus,
    expectedOutcomes,
    assessment
}) => {

    // update the lesson
    const updatedLesson = await prisma.lesson.update({
        where: {
            id: id
        },
        data: {
            lessonName: lessonName,
            completionStatus: completionStatus,
            expectedOutcomes: expectedOutcomes,
            assessment: assessment
        }
    });

    // if the lesson is not updated, we will throw an error
    if (!updatedLesson) {
        throw new Error("There was a problem updating the lesson, please try again later");
    }

    return updatedLesson;
}

// delete a lesson by lesson id
const deleteLessonById = async (id) => {

    // delete the lesson
    const deletedLesson = await prisma.lesson.delete({
        where: {
            id: id
        }
    });

    // // if the lesson is not deleted, we will throw an error
    // if (!deletedLesson) {
    //     throw new Error("There was a problem deleting the lesson, please try again later");
    // }

    return deletedLesson;
}


// now we will create a crud method to shift the lesson numbers
const changeLessonNumber = async (unitId, lessonId, newLessonNumber) => {
    // find the lesson by id (lesson that the user wants to change number)
    const oldLesson = await getLessonById(lessonId);

    // find lesson in new position by lesson number
    const newLesson = await prisma.lesson.findFirst({
        where: {
            unitId: unitId,
            lessonNumber: newLessonNumber
        }
    });

    // find all lessons for unit, sorted by lesson number asc
    const lessonsArray = await getLessonsForUnit(unitId);

    // if lesson in new position is not found, we will throw an error
    if (!newLesson) {
        throw new Error("There was a problem changing the lesson number, please try again later");
    }

    // if the lessons number is the same, we will return the old lessons array
    if (oldLesson.lessonNumber === newLesson.lessonNumber) {
        return lessonsArray;
    }

    // if the lesson number of the old position is greater than new lesson number position,
    // do the following
    if (oldLesson.lessonNumber > newLesson.lessonNumber) {
        // now we will loop through the lessons array, and update the lesson number of each lesson,
        // starting from the lesson that the user wants to change number.
        for (let i = lessonsArray.findIndex(lesson => lesson.id === newLesson.id); i < lessonsArray.length; i++) {
            // update the lesson number of the lesson
            // if the same id as the old lesson, we will update the lesson number to the new lesson number
            if (lessonsArray[i].id === oldLesson.id) {
                lessonsArray[i].lessonNumber = newLesson.lessonNumber;
                // break out of the loop
                break;
            } else {
                // if the lesson is not the same id as the old lesson, we will increment the lesson number by 1
                lessonsArray[i].lessonNumber = lessonsArray[i].lessonNumber + 1;
            }
        }

    } else {
        for (let i = lessonsArray.findIndex(lesson => lesson.id === oldLesson.id); i < lessonsArray.length; i++) {
            
            // update the lesson number of the lesson
            // if the same id as the old lesson, we will update the lesson number to the new lesson number
            if (lessonsArray[i].id === oldLesson.id) {
                lessonsArray[i].lessonNumber = newLesson.lessonNumber;
                // // break out of the loop
                // break;
            } else {
                // if the lesson is not the same id as the old lesson, we will increment the lesson number by 1
                lessonsArray[i].lessonNumber = lessonsArray[i].lessonNumber - 1;
            }

            if (lessonsArray[i].id === newLesson.id) {
                // break out of the loop
                break;
            }
        }

        
    }
    
    // now we will save the lessons array to the database
    for (let i = 0; i < lessonsArray.length; i++) {
        const updatedLesson = await prisma.lesson.update({
            where: {
                id: lessonsArray[i].id
            },
            data: {
                lessonNumber: lessonsArray[i].lessonNumber
            }
        });

        // if the lesson is not updated, we will throw an error
        if (!updatedLesson) {
            throw new Error("There was a problem updating the lesson number, please try again later");
        }
    }

    

    return lessonsArray;


}

// export all the functions
export { 
    createLessonForUnit, 
    getLessonsForUnit, 
    getLessonById, 
    updateLesson, 
    deleteLessonById, 
    changeLessonNumber 
};