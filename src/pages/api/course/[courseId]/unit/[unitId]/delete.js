import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { deleteUnit } from "@/data/dbTransactions/unit.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";

export default async function handler(req, res) {
    // get the unit number from url params
    const { courseId, unitId } = req.query;

    // if the unitId is not a number, return redirect not found
    if (isNaN(unitId) || !parseInt(unitId) || isNaN(courseId) || !parseInt(courseId)) {
        res.status(404).redirect("/404");
        return
    }

    // get the user payload from the headers x-user-payload
    const userPayloadStr = req.headers["x-user-payload"];

    try {
        // search the course from the database
        const courseFromDB = await getCourseById(parseInt(courseId));

        // validate course ownership
        const courseValidationResult = await validateCourseOwnership(courseFromDB, userPayloadStr);

        // if the courseValidationResult is not null, return redirect
        if (courseValidationResult === "/unauthorized") {
            res.status(401).redirect("/unauthorized");
        } else if (courseValidationResult === "/500") {
            res.status(500).redirect("/500");
        }

        // attempt to delete the unit from the database
        await deleteUnit(parseInt(unitId));

        // redirect to the course page
        res.status(200).redirect(`/course/${courseId}`);
        
    } catch (error) {
        res.status(500).redirect("/500");
        return
    }
}