import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function AddCourse() {
    const [courseName, setCourseName] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/course/add-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseName }),
            });
            if (response.ok) {
                // Redirect to index page after adding the course
                router.push('/');
            } else {
                console.error('Error adding course:', response.statusText);
            }
        } catch (error) {
            // Handle error
            console.error('Error adding course:', error);
        }
    };

    return (
        <div>
            <Navbar isLoggedIn={true} />
            <h1>Add Course</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Course Name:
                    <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                    />
                </label>
                <button type="submit">Add Course</button>
            </form>
        </div>
    );
}