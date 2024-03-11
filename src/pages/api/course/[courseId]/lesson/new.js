// import the validation functions
import { createLessonForUnit, changeLessonNumber } from "@/data/dbTransactions/lesson.dbTransaction";
import { isNotEmpty, isNotUndefined, isSanitizedStringZod } from "@/utils/validation/validationAll";

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
    
    // perform validations before saving the data using the validation functions
    // if the data is invalid, return a 400 response
    if (!isNotEmpty(formData.lessonName)) {
        return res.status(400).json({ message: "Lesson Name is required" });
    }

    if (!isNotEmpty(formData.lessonNumber)) {
        return res.status(400).json({ message: "Lesson Number is required" });
    }

    if (!isNotEmpty(formData.completedStatus)) {
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

    if (!isSanitizedStringZod(formData.completedStatus)) {
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
        const createdLesson = await createLessonForUnit({
            unitId: parseInt(formData.unitId),
            lessonName: formData.lessonName,
            completionStatus: formData.completedStatus,
            expectedOutcomes: formData.expectedOutcomes,
            assessment: formData.assessment
        });

        // if the lesson is not created, return a 500 response
        if (!createdLesson) {
            throw new Error("There was a problem creating the lesson, please try again later");
        }

        // if lesson number is not the same as the created lesson number, change the lesson number to the new one
        // and shift the following lesson values for the unit using our dbTransaction function
        if (formData.lessonNumber !== createdLesson.lessonNumber) {
            const updatedLesson = await changeLessonNumber(
                parseInt(formData.unitId),
                parseInt(createdLesson.id),
                parseInt(formData.lessonNumber)
            );

            // if the lesson is not updated, return a 500 response
            if (!updatedLesson) {
                throw new Error("There was a problem updating the lesson number, please try again later");
            }
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    
    // return a 200 response
    res.status(200).json({ message: "Lesson created successfully" });
}