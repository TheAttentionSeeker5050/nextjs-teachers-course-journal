import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { deleteUnit } from "@/data/dbTransactions/unit.dbTransaction";

export default async function handler(req, res) {
    // get the unit number from url params
    const { courseId, unitId } = req.query;

    // get the user payload from the headers x-user-payload
    const userPayloadStr = req.headers["x-user-payload"];
    const user = JSON.parse(userPayloadStr);

    // search the course from the database
    const courseFromDB = await getCourseById(parseInt(courseId));
    
    // if the course is not found, or the user is not authorized, return redirect unauthorized
    if (!user || !user.userId || user.userId !== courseFromDB.userId) {
        res.status(401).redirect("/unauthorized");
        return
    }

    // if the unitId is not a number, return redirect not found
    if (isNaN(unitId) || !parseInt(unitId)) {
        res.status(404).redirect("/404");
        return
    }

    try {
        // attempt to delete the unit from the database
        await deleteUnit(parseInt(unitId));

        // redirect to the course page
        res.status(200).redirect(`/course/${courseId}`);
        
    } catch (error) {
        res.status(500).redirect("/500");
        return
    }
}