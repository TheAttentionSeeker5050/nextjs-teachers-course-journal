import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

export default function AddCourse() {
    const [courseName, setCourseName] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [hideCourse, setHideCourse] = useState(false);
    
    // form response
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // set is loading
        setIsLoading(true);

        // set form data
        const formData = new FormData();
        formData.append('courseName', courseName);
        formData.append('thumbnail', thumbnail);
        formData.append('hideCourse', hideCourse);

        try {

            // validate course name
            if (courseName.trim() === '') {
                setErrorMessage('Course name is required');
                return;
            }

            // validate thumbnail
            if (thumbnail === '') {
                setErrorMessage('Thumbnail is required');
                return;
            }

            const response = await fetch('/api/course/new', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json'
                // },
                body: formData
            });

            // print the json response
            const jsonResponse = await response.json();

            if (response.ok) {
                setIsLoading(false);

                setSuccessMessage('Course added successfully!');
                // Redirect after a short delay
                setTimeout(() => {
                    router.push('/');
                }, 2000); // Redirect after 2 seconds

            } else {
                throw new Error(jsonResponse.error);
            }

        } catch (error) {
            setErrorMessage('Failed to add course: ' + error.message);
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
                    />

                    <label htmlFor="thumbnail" className="text-lg mb-2">Course Thumbnail:</label>
                    <input
                        id="thumbnail"
                        type="file"
                        className="border border-gray-400 rounded px-3 py-2 mb-4"
                        onChange={(e) => setThumbnail(e.target.files[0])}
                    />

                    <div className="flex items-center  gap-3 mb-4">
                        <label htmlFor="hideCourse" className="text-lg">Hide Course:</label>
                        <input
                            id="hideCourse"
                            type="checkbox"
                            className="border border-gray-400 rounded px-3 py-2"
                            checked={hideCourse}
                            onChange={(e) => setHideCourse(e.target.checked)}
                        />
                    </div>

                    <button type="submit" className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600">Add Course</button>
                </form>
            </div>
        </div>
    );
}
