import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function AddCourse() {
    const [courseName, setCourseName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/course/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ courseName }),
            });
            if (response.ok) {
                setSuccessMessage('Course added successfully!');
                // Redirect after a short delay
                setTimeout(() => {
                    router.push('/');
                }, 2000); // Redirect after 2 seconds
            } else {
                console.error('Error adding course:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    return (
        <div>
            <Navbar isLoggedIn={true} />
            <div className={`${inter.className} flex flex-col items-center justify-center mt-8`}>
                <h1 className="text-3xl font-bold mb-6">Add Course</h1>
                {successMessage && (
                    <p className="text-green-500 mb-4">{successMessage}</p>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <label htmlFor="courseName" className="text-lg mb-2">Course Name:</label>
                    <input
                        id="courseName"
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="border border-gray-400 rounded px-3 py-2 mb-4"
                        required
                    />
                    <button type="submit" className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600">Add Course</button>
                </form>
            </div>
        </div>
    );
}
