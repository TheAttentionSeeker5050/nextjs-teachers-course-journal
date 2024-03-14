import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { updateUnit, updateUnitNumber } from "@/data/dbTransactions/unit.dbTransaction";

import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    // get the course id and unit id from the query params
    const { courseId, unitId } = req.query;

    // if the courseId or unitId is not a number, return a 404
    if (isNaN(courseId) || !parseInt(courseId) || isNaN(unitId) || !parseInt(unitId)) {
        res.status(404).json({ error: "Not found" });
        return;
    }

    // get the response body
    const { unitName, unitNumber } = req.body;
    // if the unitName or unitNumber is not present, return a 400
    if (!unitName || !unitNumber) {
        res.status(400).json({ error: "Bad request" });
        return;
    }

    // get the user payload and parse it
    const userPayloadStr = req.headers["x-user-payload"];
    // const user = JSON.parse(userPayloadStr);

    try {
        // search the course from the database
        const courseFromDB = await getCourseById(parseInt(courseId));

        // validate course ownership
        const courseValidationResult = await validateCourseOwnership(courseFromDB, userPayloadStr);

        // if the courseValidationResult is not null, return redirect
        if (courseValidationResult === "/unauthorized") {
            res.status(401).json({ error: "Unauthorized" });
        } else if (courseValidationResult === "/500") {
            res.status(500).json({ error: "Internal server error" });
        }
        
        // if the unitId is not a number, return redirect not found
        if (isNaN(unitId) || !parseInt(unitId)) {
            res.status(404).json({ error: "Not found" });
            return
        }

        // attempt to update the unit from the database
        const updatedUnit = await updateUnit({
            id: parseInt(unitId), 
            newUnitName: unitName
        });
        
        // compare the updated unit number to the unit number from the request body
        if (updatedUnit.unitNumber !== parseInt(unitNumber)) {
            // if the unit number is different, we will update the unit number
            await updateUnitNumber(parseInt(courseId), parseInt(unitId), parseInt(unitNumber));
        }


    } catch (error) {
        res.status(500).json({ error: error.message });
        return
    }

    res.status(200).json({ message: "Unit updated successfully" });
}