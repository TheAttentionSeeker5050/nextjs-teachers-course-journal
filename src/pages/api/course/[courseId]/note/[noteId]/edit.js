import { updateNote } from '@/data/dbTransactions/note.dbTransaction';

export default async function handler(req, res) {
    const { courseId, noteId } = req.query;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
    }

    try {
        const { title, content } = req.body;

        // Update the note in the database
        await updateNote({ id: parseInt(noteId), title, note: content });

        res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
}
