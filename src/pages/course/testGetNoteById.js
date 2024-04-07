const { PrismaClient } = require('@prisma/client');

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Function to test getNoteById
async function testGetNoteById() {
    try {
        const noteId = 3;
        const note = await prisma.note.findUnique({
            where: {
                id: noteId
            }
        });
        console.log('Note:', note);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Call the function
testGetNoteById();
