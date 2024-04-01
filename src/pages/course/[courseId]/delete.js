import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
import { getCourseById } from '@/data/dbTransactions/course.dbTransaction';

const inter = Inter({ subsets: ["latin"] });

const DeleteCoursePage = ({ initialCourse }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { courseId } = router.query;

    const handleDelete = async () => {
        // Logic to delete the course via API
        try {
            setLoading(true);
            const response = await fetch(`/api/course/${courseId}/delete`, {
                method: 'DELETE',
            });
            if (response.ok) {
                router.push('/');
            } else {
                setError('Failed to delete course');
            }
        } catch (error) {
            setError('Error deleting course: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar isLoggedIn={true} />
            <div className={`${inter.className} min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8`}>
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Delete Course</h1>
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                        <div>
                            <p className="mb-4">Are you sure you want to delete the course <span className="font-semibold text-red-500">{initialCourse.courseName}</span>?</p>
                            <div className="flex gap-3 justify-stretch text-white my-4 text-center">
                                <button onClick={handleDelete} className="p-2 bg-primary-600 rounded-lg flex-grow">
                                    Delete
                                </button>
                                <button onClick={() => router.push(`/`)} className="p-2 bg-slate-600 rounded-lg flex-grow">
                                    Cancel
                                </button>
                            </div>
                        </div>
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
        return {
            props: { initialCourse: null }
        };
    }
}

export default DeleteCoursePage;
