import { updateLesson, changeLessonNumber } from "@/data/dbTransactions/lesson.dbTransaction";
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";
import { isNotEmpty, isSanitizedStringZod } from "@/utils/validation/validationAll";


export default async function (req, res) {
    // if different to post request, return 405 method not allowed
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // get the request body
    const formData = req.body;

    if (!formData) {
        return res.status(400).json({ message: "Invalid request body" });
    }

    // get the courseId and lessonId from the url parameters
    const { courseId, lessonId } = req.query;
    
    try {
        // get the user payload from the headers x-user-payload
        const userPayloadStr = req.headers["x-user-payload"];

        // get the course from database
        const courseFromDB = await getCourseById(parseInt(courseId));

        // validate course ownership
        const courseValidationResult = await validateCourseOwnership(courseFromDB, userPayloadStr);

        // if the courseValidationResult is not null, return unauthorized
        if (courseValidationResult) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        return res.status(500).json({ message: "There was a problem retrieving the course, please try again later" });
    }

    

    // perform validations before saving the data using the validation functions
    // if the data is invalid, return a 400 response
    if (!isNotEmpty(formData.lessonName)) {
        return res.status(400).json({ message: "Lesson Name is required" });
    }

    if (!isNotEmpty(formData.lessonNumber)) {
        return res.status(400).json({ message: "Lesson Number is required" });
    }

    if (!isNotEmpty(formData.completionStatus)) {
        return res.status(400).json({ message: "Completed Status is required" });
    }

    if (!isNotEmpty(formData.expectedOutcomes)) {
        return res.status(400).json({ message: "Expected Outcomes is required" });
    }

    if (!isNotEmpty(formData.assessment)) {
        return res.status(400).json({ message: "Assessment is required" });
    }

    if (!isSanitizedStringZod(formData.lessonName)) {
        return res.status(400).json({ message: "Invalid Lesson Name" });
    }

    if (!isSanitizedStringZod(formData.lessonNumber)) {
        return res.status(400).json({ message: "Invalid Lesson Number" });
    }

    if (!isSanitizedStringZod(formData.completionStatus)) {
        return res.status(400).json({ message: "Invalid Completed Status" });
    }

    if (!isSanitizedStringZod(formData.expectedOutcomes)) {
        return res.status(400).json({ message: "Invalid Expected Outcomes" });
    }

    if (!isSanitizedStringZod(formData.assessment)) {
        return res.status(400).json({ message: "Invalid Assessment" });
    }

    try {
        // save the data to the database
        const updatedLesson = await updateLesson({
            id: parseInt(lessonId),
            lessonName: formData.lessonName,
            completionStatus: formData.completedStatus,
            expectedOutcomes: formData.expectedOutcomes,
            assessment: formData.assessment
        });

        // if the lesson is not updated, return a 500 response
        if (!updatedLesson) {
            return res.status(500).json({ message: "There was a problem updating the lesson, please try again later" });
        }

        // if the lesson number is different, change the lesson number
        if (updatedLesson.lessonNumber !== parseInt(formData.lessonNumber)) {
            await changeLessonNumber(
                updatedLesson.unitId,
                updatedLesson.id,
                parseInt(formData.lessonNumber)
            );
        }

        // if the lesson is updated, return a 200 response
        return res.status(200).json({ name: "Lesson Updated Successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "There was a problem updating the lesson, please try again later" });
    }
}