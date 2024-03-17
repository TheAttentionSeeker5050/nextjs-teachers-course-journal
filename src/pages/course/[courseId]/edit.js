import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const EditCoursePage = () => {
    // Access the router to get the courseId from the URL
    const router = useRouter();
    const { courseId } = router.query;

    // State variables for the course data
    const [courseName, setCourseName] = useState('');
    // Add more state variables as needed for other course details

    // Function to fetch course data from the API
    const fetchCourseData = async () => {
        try {
            // Fetch course data from the API using the courseId
            const response = await fetch(`/api/course/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                // Update state with the fetched course data
                setCourseName(data.courseName);
                // Update other state variables with fetched course details
            } else {
                // Handle error if fetching course data fails
                console.error('Failed to fetch course data');
            }
        } catch (error) {
            // Handle any other errors that occur during fetching
            console.error('Error fetching course data:', error);
        }
    };

    // Use useEffect to fetch course data when the component mounts
    useEffect(() => {
        fetchCourseData();
    }, []);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add logic to submit updated course data to the API
    };

    return (
        <div>
            <Navbar isLoggedIn={true} />
            <h1>Edit Course</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Course Name:
                    <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                    />
                </label>

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditCoursePage;
