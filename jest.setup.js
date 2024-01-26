import '@testing-library/jest-dom'

import Prisma from "@/data/prisma";


beforeEach(async () => {
    // delete all the users, courses, and units
    await Prisma.user.deleteMany();
    await Prisma.course.deleteMany();
    await Prisma.unit.deleteMany();
})