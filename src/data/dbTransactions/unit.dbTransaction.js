import prisma from "@/data/prisma";

// create a new unit
const createUnit = async ({
    unitName,
    unitNumber,
    courseId
}) => {

    // create a new unit
    const createdUnit = await prisma.unit.create({
        data: {
            unitName: unitName,
            unitNumber: unitNumber,
            courseId: courseId,
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
    newUnitNumber,
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
            unitNumber: newUnitNumber ? newUnitNumber : unit.unitNumber,
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

// export all the functions
export {
    createUnit,
    getUnitsByCourseId,
    getUnitById,
    updateUnit,
    deleteUnit,
}