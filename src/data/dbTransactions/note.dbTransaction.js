
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to create a new note
async function createNote({ title, note, userId, lessonId }) {
    return prisma.note.create({
        data: {
            title,
            note,
            userId,
            lessonId
        }
    });
}

// Function to update an existing note
async function updateNote({ id, title, note }) {
    return prisma.note.update({
        where: {
            id
        },
        data: {
            title,
            note
        }
    });
}

async function getNoteById(noteId) {
    try {
        return await prisma.note.findUnique({
            where: {
                id: noteId
            }
        });
    } catch (error) {
        console.error('Error retrieving note by ID:', error);
        throw new Error('Failed to retrieve note by ID');
    }
}

// Function to delete a note by its ID
async function deleteNoteById(id) {
    return prisma.note.delete({
        where: {
            id
        }
    });
}

// Function to get all notes associated with a user
async function getNotesByUserId(userId) {
    return prisma.note.findMany({
        where: {
            userId
        }
    });
}

// Function to get all notes associated with a lesson
async function getNotesByLessonId(lessonId) {
    return prisma.note.findMany({
        where: {
            lessonId
        }
    });
}

module.exports = {
    createNote,
    updateNote,
    getNoteById,
    deleteNoteById,
    getNotesByUserId,
    getNotesByLessonId
};
