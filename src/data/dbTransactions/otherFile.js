
// now we will create a crud method that will do the following:
// in this app, users are able to change the lesson number
// to to do this, we follow the following steps:
// // 1. get all the lessons for the unit
// // 2. save the lesson number of the updating lesson in a variable
// // 3. loop through the lessons and update the lesson number,
// // starting from the lesson that the user wants to change number.
// // the getAllLessonsForUnit method will return the lessons in order of lesson number ascending 
// // 4. update the lesson number in each iteration, and increment the lesson number in variable by 1
// // 5. show any error messages if there are any
// // 6. return the updated lessons
// const updateLessonNumber = async (unitId, lessonId, newLessonNumber) => {
    
//         // get all the lessons for the unit
//         const lessons = await getLessonsForUnit(unitId);
    
//         // save the lesson number of the updating lesson in a variable
//         const oldLessonNumber = lessons.find(lesson => lesson.id === lessonId).lessonNumber;
    
//         // loop through the lessons and update the lesson number,
//         // starting from the lesson that the user wants to change number.
//         // the getAllLessonsForUnit method will return the lessons in order of lesson number ascending 
//         // update the lesson number in each iteration, and increment the lesson number in variable by 1
//         for (let i = oldLessonNumber; i < lessons.length; i++) {
//             await prisma.lesson.update({
//                 where: {
//                     id: lessons[i].id
//                 },
//                 data: {
//                     lessonNumber: i + 1
//                 }
//             });
//         }
    
//         // update the lesson number of the lesson that the user wants to change number
//         const updatedLesson = await prisma.lesson.update({
//             where: {
//                 id: lessonId
//             },
//             data: {
//                 lessonNumber: newLessonNumber
//             }
//         });
    
//         // if the lesson is not updated, we will throw an error
//         if (!updatedLesson) {
//             throw new Error("There was a problem updating the lesson number, please try again later");
//         }
    
//         return updatedLesson;
//     }