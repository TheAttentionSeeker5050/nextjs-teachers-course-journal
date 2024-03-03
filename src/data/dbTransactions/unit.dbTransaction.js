import prisma from "@/data/prisma";

// create a new unit
const createUnit = async ({
    unitName,
    courseId
}) => {

    // get the length of the units for course
    const units = await getUnitsByCourseId(courseId);
    const unitLength = units.length;

    // create a new unit
    const createdUnit = await prisma.unit.create({
        data: {
            unitName: unitName,
            unitNumber: unitLength + 1,
            courseId: courseId,
            dateCreated: new Date(),
            dateUpdated: new Date(),
        }
    });

    // if the unit is not created, we will throw an error
    if (!createdUnit) {
        throw new Error("There was a problem creating the unit, please try again later");
    }

    return createdUnit;
}

// get all units for courses
const getUnitsByCourseId = async (courseId) => {


    // get all units for the course
    const units = await prisma.unit.findMany({
        where: {
            courseId: courseId
        },
        orderBy: {
            unitNumber: "asc"
        }
    });

    // if the units are not retrieved, we will throw an error
    if (!units) {
        throw new Error("There was a problem retrieving the units, please try again later");
    }

    return units;
}

// get unit by id
const getUnitById = async (id) => {

    // get the unit by id
    const unit = await prisma.unit.findUnique({
        where: {
            id: id
        }
    });

    // if the unit is not retrieved, we will throw an error
    if (!unit) {
        throw new Error("There was a problem retrieving the unit, please try again later");
    }

    return unit;
}

// update unit
const updateUnit = async ({
    id,
    newUnitName,
}) => {
    
    // get the unit by id
    const unit = await getUnitById(id);

    // if the unit is not retrieved, we will throw an error
    if (!unit) {
        throw new Error("There was a problem retrieving the unit, please try again later");
    }

    // update the unit
    const updatedUnit = await prisma.unit.update({
        where: {
            id: id,
        },
        data: {
            unitName: newUnitName ? newUnitName : unit.unitName,
            dateUpdated: new Date(),
        }
    });

    // if the unit is not updated, we will throw an error
    if (!updatedUnit) {
        throw new Error("There was a problem updating the unit, please try again later");
    }

    return updatedUnit;
}

// delete unit
const deleteUnit = async (id) => {
    
    // get the unit by id
    const unit = await getUnitById(id);

    // if the unit is not retrieved, we will throw an error
    if (!unit) {
        throw new Error("There was a problem retrieving the unit, please try again later");
    }

    // delete the unit
    const deletedUnit = await prisma.unit.delete({
        where: {
            id: id
        }
    });

    // if the unit is not deleted, we will throw an error
    if (!deletedUnit) {
        throw new Error("There was a problem deleting the unit, please try again later");
    }

    return deletedUnit;
}

// same as we did with lessons, we will create a method that will update the unit number
const updateUnitNumber = async (courseId, unitId, newUnitNumber) => {
        // get all the units for the course
        const unitsArray = await getUnitsByCourseId(courseId);
    
        // save the unit number of the updating unit in a variable
        const oldUnit = await prisma.unit.findFirst({
            where: {
                id: unitId
            }
        });

        const newUnit = await prisma.unit.findFirst({
            where: {
                unitNumber: newUnitNumber
            }
        });
        
        // if the unit number is the same, we will just return the array of units
        if (oldUnit.unitNumber === newUnitNumber) {
            return unitsArray;
        }

        if (oldUnit.unitNumber > newUnit.unitNumber) {
            for (let i = unitsArray.findIndex(unit => unit.id === newUnit.id); i < unitsArray.length; i++) {
                // update the unit number
                // if the id is the same as the old unit id, we will update the unit number to the new unit number
                
                if (unitsArray[i].id === oldUnit.id) {
                    unitsArray[i].unitNumber = newUnit.unitNumber;
                    break;
                } else {
                    unitsArray[i].unitNumber = unitsArray[i].unitNumber + 1;
                }
            }
        } else {
            for (let i = unitsArray.findIndex(unit => unit.id === oldUnit.id); i < unitsArray.length; i++) {
                // update the unit number
                // if the id is the same as the old unit id, we will update the unit number to the new unit number
                if (unitsArray[i].id === oldUnit.id) {
                    unitsArray[i].unitNumber = newUnit.unitNumber;
                    // break;
                } else {
                    unitsArray[i].unitNumber = unitsArray[i].unitNumber - 1;
                }

                // if the id is the same as the new unit id, break out of the loop
                if (unitsArray[i].id === newUnit.id) {
                    break;
                }
            }
        }

        // now update the unit numbers in the database
        for (let i = 0; i < unitsArray.length; i++) {
            const updatedUnits = await prisma.unit.update({
                where: {
                    id: unitsArray[i].id
                },
                data: {
                    unitNumber: unitsArray[i].unitNumber
                }
            });

            // if the unit is not updated, we will throw an error
            if (!updatedUnits) {
                throw new Error("There was a problem updating the unit number, please try again later");
            }
        }

        // return the units array
        return unitsArray;
    }

// export all the functions
export {
    createUnit,
    getUnitsByCourseId,
    getUnitById,
    updateUnit,
    deleteUnit,
    updateUnitNumber,
}