import { createCourse } from '@/data/dbTransactions/course.dbTransaction';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { courseName } = req.body;
        // Get userId from user payload
        const userId = req.headers['x-user-payload'] ? JSON.parse(req.headers['x-user-payload']).userId : null;

        // Check if userId is available
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const newCourse = await createCourse({ courseName: courseName, userId: userId });
            res.status(201).json(newCourse);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create course' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
