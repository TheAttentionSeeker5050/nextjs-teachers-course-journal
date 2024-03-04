import { useState } from 'react';
import { useRouter } from 'next/router';
import { createCourse } from '@/data/dbTransactions/course.dbTransaction';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function AddCourse() {
    const [courseName, setCourseName] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCourse({ courseName });
            // Redirect to index page after adding the course
            router.push('/');
        } catch (error) {
            // Handle error
            console.error('Error adding course:', error);
        }
    };

    return (
        <div>
            <h1>Add Course</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Course Name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                />
                <button type="submit">Add Course</button>
            </form>
        </div>
    );
}

