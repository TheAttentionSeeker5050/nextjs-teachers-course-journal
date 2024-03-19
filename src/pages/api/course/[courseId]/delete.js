import { deleteCourse, getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";

export default async function handler(req, res) {
    // Get the course ID from the URL params
    const { courseId } = req.query;

    try {
        // Fetch the course from the database
        const courseFromDB = await getCourseById(parseInt(courseId));

        // Check if the course exists
        if (!courseFromDB) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Validate course ownership
        const validationResult = await validateCourseOwnership(courseFromDB, req.headers["x-user-payload"]);

        // If the user is not authorized to delete the course, return an unauthorized error
        if (validationResult) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Delete the course from the database
        await deleteCourse(parseInt(courseId));

        // Return a success message
        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        // Return a server error if an error occurs
        console.error("Error deleting course:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
