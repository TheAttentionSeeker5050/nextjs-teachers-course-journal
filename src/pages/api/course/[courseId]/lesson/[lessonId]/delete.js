import { deleteLessonById } from "@/data/dbTransactions/lesson.dbTransaction";
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";

export default async function (req, res) {
    // if anything other than post, return 405 method not allowed
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // get the courseId and lessonId from the url parameters
    const { courseId, lessonId } = req.query;

    // if the courseId or lessonId is not a number, return 400 bad request
    if (isNaN(courseId) || !parseInt(courseId) || isNaN(lessonId) || !parseInt(lessonId)) {
        return res.status(400).json({ message: 'Bad request' });
    }

    // get the user payload from the headers x-user-payload
    const userPayloadStr = req.headers["x-user-payload"];

    // get the course from database
    const courseFromDB = await getCourseById(parseInt(courseId));

    // validate course ownership
    const courseValidationResult = await validateCourseOwnership(courseFromDB, userPayloadStr);

    // if the courseValidationResult is not null, redirect to unauthorized
    if (courseValidationResult) {
        return res.status(302).redirect("/unauthorized");
    }

    // attempt to delete the lesson from the database
    try {
        await deleteLessonById(parseInt(lessonId));
        return res.status(200).redirect(`/course/${courseId}`);
    } catch (error) {
        return res.status(500).redirect("/500");
    }
 
}