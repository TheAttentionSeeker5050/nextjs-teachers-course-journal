import { updateCourse, getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";

export default async function handler(req, res) {
    const { courseId } = req.query;

    if (req.method === "POST") {
        // Handle POST request to update course data
        const { courseName } = req.body;

        if (!courseName) {
            res.status(400).json({ error: "Course name is required" });
            return;
        }

        try {
            const course = await getCourseById(parseInt(courseId));
            const validationResult = await validateCourseOwnership(course, req.headers["x-user-payload"]);

            if (validationResult) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            await updateCourse({
                id: parseInt(courseId),
                newCourseName: courseName
            });

            res.status(200).json({ message: "Course updated successfully" });
        } catch (error) {
            console.error("Error updating course:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
