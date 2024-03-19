import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
import { getCourseById } from '@/data/dbTransactions/course.dbTransaction';

const inter = Inter({ subsets: ["latin"] });

const EditCoursePage = ({ initialCourse }) => {
    const [courseName, setCourseName] = useState(initialCourse.courseName);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { courseId } = router.query;

    const handleSubmit = async (e) => {
        e.preventDefault();
        // logic to submit updated course data to the API
        try {
            setLoading(true);
            const response = await fetch(`/api/course/${courseId}/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ courseName })
            });
            if (response.ok) {
                router.push('/');
            } else {
                setError('Failed to update course');
            }
        } catch (error) {
            setError('Error updating course: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/');
    };

    return (
        <div>
            <Navbar isLoggedIn={true} />
            <div className={`${inter.className} min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8`}>
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Edit Course</h1>
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                            <div className="mb-4">
                                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">Course Name:</label>
                                <input
                                    id="courseName"
                                    type="text"
                                    value={courseName}
                                    onChange={(e) => setCourseName(e.target.value)}
                                    className="mt-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 px-3 py-2"
                                />
                            </div>
                            <div>
                                <button type="submit" className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:bg-primary-600">Save Changes</button>
                                <button type="button" onClick={handleCancel} className="ml-2 text-white px-4 py-2 p-4 bg-slate-600 rounded-lg flex-grow">Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    const { courseId } = context.params;
    try {
        const initialCourse = await getCourseById(parseInt(courseId));
        // Convert the Date objects to string representations
        initialCourse.dateCreated = initialCourse.dateCreated.toISOString();
        initialCourse.dateUpdated = initialCourse.dateUpdated.toISOString();
        return {
            props: { initialCourse }
        };
    } catch (error) {
        console.error('Error fetching course data:', error);
        return {
            props: { initialCourse: null }
        };
    }
}

export default EditCoursePage;
