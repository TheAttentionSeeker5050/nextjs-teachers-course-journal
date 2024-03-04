import { createCourse } from '@/data/dbTransactions/course.dbTransaction';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { courseName } = req.body;
        try {
            const newCourse = await createCourse({ courseName });
            res.status(201).json(newCourse);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create course' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}