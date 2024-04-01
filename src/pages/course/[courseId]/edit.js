import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
import { getCourseById } from '@/data/dbTransactions/course.dbTransaction';

const inter = Inter({ subsets: ["latin"] });

const EditCoursePage = ({ initialCourse }) => {
    // form state  variables
    const [courseName, setCourseName] = useState(initialCourse.courseName);
    const [thumbnail, setThumbnail] = useState(null);
    const [hideCourse, setHideCourse] = useState(initialCourse.isArchived);

    // form response
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const router = useRouter();
    const { courseId } = router.query;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // delete the error and success messages
        setError('');
        setSuccessMessage('');

        // set is loading
        setLoading(true);

        // the form data
        const formData = new FormData();
        formData.append('courseName', courseName);
        formData.append('thumbnail', thumbnail);
        formData.append('hideCourse', hideCourse);

        // logic to submit updated course data to the API
        try {
            // validate course name
            if (courseName.trim() === '') {
                setError('Course name is required');
                return;
            }

            const response = await fetch(`/api/course/${courseId}/edit`, {
                method: 'POST',
                body: formData
            });

            const jsonResponse = await response.json();

            if (response.ok) {
                setSuccessMessage('Course added successfully!');


                // Redirect after a short delay
                setTimeout(() => {
                    router.push('/');
                }, 2000); // Redirect after 2 seconds
            } else {
                throw new Error(jsonResponse.error);
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
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Edit Course</h1>

                    {loading && <p className="text-lg my-2 text-center">Loading...</p>}
                    
                    {
                        error && 
                        <p className="text-red-500 my-2 text-center">
                            {error}
                        </p>
                    }

                    {
                        successMessage &&
                        <p className="text-green-500 my-2 text-center">
                            {successMessage}
                        </p>
                    }
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

                            <div className="mb-4">
                                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Thumbnail:</label>
                                <input
                                    id="thumbnail"
                                    type="file"
                                    className="mt-2 block"
                                    onChange={(e) => setThumbnail(e.target.files[0])}
                                    accept=".png, .jpg, .jpeg"
                                />
                            </div>

                            <div className="mb-4 ">
                                <label htmlFor="hideCourse" className="block text-sm font-medium text-gray-700">Hide Course:</label>
                                <input
                                    id="hideCourse"
                                    type="checkbox"
                                    className="mt-2 block"
                                    checked={hideCourse}
                                    onChange={(e) => setHideCourse(e.target.checked)}
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
        
        return {
            props: { initialCourse: null }
        };
    }
}

export default EditCoursePage;
