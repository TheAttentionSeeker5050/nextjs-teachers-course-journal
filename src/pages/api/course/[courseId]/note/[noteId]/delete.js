import { deleteNoteById } from '@/data/dbTransactions/note.dbTransaction';

export default async function handler(req, res) {
    const {
        query: { courseId, noteId },
    } = req;

    try {
        // Delete the note by its ID
        await deleteNoteById(parseInt(noteId));

        // Return success message
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        // Return error message
        res.status(500).json({ error: 'Error deleting note: ' + error.message });
    }
}
