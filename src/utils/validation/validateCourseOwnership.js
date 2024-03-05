

export async function validateCourseOwnership(courseFromDB, userPayloadStr) {

    if (!courseFromDB) {
        return "/500";
    }

    // parse the user payload, if it is not parsable, throw an error
    try {
        // get the user payload from the headers x-user-payload and parse it
        const user = JSON.parse(userPayloadStr);

        // if the user.userId is not the same as the unitFromDB.userId, return redirect not found
        if (!user || user.userId !== courseFromDB.userId || !courseFromDB.userId || !user.userId) {
            return "/unauthorized"
        }

    } catch (e) {
        return "/unauthorized"
    }

    return null;
}