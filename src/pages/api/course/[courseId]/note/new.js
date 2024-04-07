import { createNote } from '@/data/dbTransactions/note.dbTransaction';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { courseId, lessonId, title, content } = req.body;
        console.log("lessonId", lessonId)

        // Get userId from user payload
        const userId = req.headers['x-user-payload'] ? JSON.parse(req.headers['x-user-payload']).userId : null;

        // Check if userId is available
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            // Create a new note in the database
            await createNote({
                title,
                note: content,
                userId,
                lessonId: parseInt(lessonId),
            });

            // Return success message
            return res.status(201).json({ message: 'Note created successfully' });
        } catch (error) {
            // Return any error that occurs
            return res.status(500).json({ error: 'Failed to create note' });
        }
    } else {
        // If the request method is not POST, return 405 Method Not Allowed
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
