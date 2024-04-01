import { deleteCourse, getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";
import multer from "multer";
import path from "path";
import fs from "fs";


// Define storage location and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'public/thumbnails')); // Define private directory location
    },
});

// Initialize multer with storage
const upload = multer({ storage: storage });

export const config = {
    api: {
        bodyParser: false, // Disable default body parsing
    },
};

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

        console.log("Deleting course:", courseFromDB);

        // delete the thumbnail if it exists
        if (courseFromDB.thumbnail !== null) {
            const thumbnailPath = path.join(process.cwd(), 'public/thumbnails', courseFromDB.thumbnail);
            if (fs.existsSync(thumbnailPath)) {
                fs.unlinkSync(thumbnailPath);
            } 
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
