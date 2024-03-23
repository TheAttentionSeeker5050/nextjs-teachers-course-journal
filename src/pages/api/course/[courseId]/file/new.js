import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";



export default async function (req, res) {
    // if different than post, return 405 method not allowed
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // get courseId from the query
    const { courseId } = req.query

    // attempt to validate the course ownership
    try {
        // get the user payload from the headers x-user-payload
        const userPayloadStr = req.headers['x-user-payload']

        // get the course from the database
        const courseFromDB = await getCourseById(parseInt(courseId))

        // validate course ownership
        const courseValidationResult = await validateCourseOwnership(courseFromDB, userPayloadStr)

        // if the courseValidationResult is not null, return unauthorized
        if (courseValidationResult) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
    } catch (error) {
        return res.status(500).json({ message: "There was a problem retrieving the course data, please try again later" });
    }

    try {

        // get the form data and parse it
        const formData = req.body;
        

        // if no form data, no file uploaded, return request invalid
        if (!formData) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        if (!req.body.lessonId) {
            return res.status(400).json({ message: "Lesson ID is required" });
        }

        if (!formData.userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // if no file, return request invalid
        if (!formData.file) {
            return res.status(400).json({ message: "File is required" });
        }

        // if file is not formatted as a file, return request invalid
        if (typeof formData.file !== 'object') {
            return res.status(400).json({ message: "Invalid file format" });
        }



        res.status(200).json({ name: 'Example' })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "There was a problem uploading the file, please try again later" });
    }
}