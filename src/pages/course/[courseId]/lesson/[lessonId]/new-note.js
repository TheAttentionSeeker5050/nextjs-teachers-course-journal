import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
import CustomEditor from "@/components/editorComponent";
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";


const inter = Inter({ subsets: ["latin"] });

const NewNotePage = (props) => {
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(props.error);
    const router = useRouter();

    // Refs for TinyMCE editors
    const noteContentEditorRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate note title
            if (!noteTitle.trim()) {
                throw new Error('Note title is required');
            }

            // Get note content from TinyMCE editor
            const noteContent = noteContentEditorRef.current.getContent();

            // Send a request to the API route to create a new note
            const response = await fetch(`/api/course/${props.courseId}/note/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: noteTitle,
                    content: noteContent,
                    courseId: props.courseId,
                    lessonId: props.lessonId,
                }),
            });

            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Failed to create note');
            }

            // Redirect to the lesson page after creating the note
            router.push(`/course/${props.courseId}/lesson/${props.lessonId}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push(`/course/${props.courseId}/lesson/${props.lessonId}`);
    };

    return (
        <div>
            <Navbar isLoggedIn={true} />
            <div className={`${inter.className} min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8`}>
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Add New Note</h1>
                    {error && <p className="text-red-500">{error}</p>}
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                        <div className="mb-4">
                            <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700">Note Title:</label>
                            <input
                                id="noteTitle"
                                type="text"
                                value={noteTitle}
                                onChange={(e) => {
                                    setNoteTitle(e.target.value)
                                }}
                                className="mt-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 px-3 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700">Note Content:</label>
                            {/* TinyMCE Editor */}
                            <CustomEditor
                                apiKey={props.tinyMCEApiKey}
                                fieldName="noteContent"
                                editorRef={noteContentEditorRef}
                            />
                        </div>
                        <div>
                            <button type="submit" className="bg-primary-500 text-white px-4 py-2 mr-3 rounded-md hover:bg-primary-600 focus:outline-none focus:bg-primary-600" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Note'}
                            </button>
                            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 p-4 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    const { courseId, lessonId } = context.params;

    const tinyMCEApiKey = process.env.TINYMCE_API_KEY;

    try {
        // verify user is authorized to view this page
        // get the course data using db transaction
        const course = await getCourseById(parseInt(courseId));  
        // get user payload from the context
        const userPayloadString = context.req.headers["x-user-payload"];

        // use our validate ownership method
        const validationResult = await validateCourseOwnership(course, userPayloadString);

        if (validationResult) {
            return {
                redirect: {
                    destination: validationResult || "/404",
                    permanent: false
                }
            }
        }

    } catch (error) {
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        }
    }

    // now attempt to get the lesson data and the editor key
    try {


        return {
            props: {
                courseId: courseId,
                lessonId: lessonId,
                tinyMCEApiKey: tinyMCEApiKey,
                error: null
            }
        };
    } catch (error) {
        return {
            props: {
                courseId: courseId,
                lessonId: lessonId,
                tinyMCEApiKey: tinyMCEApiKey,
                error: error.message
            }
        }
    }
    

    
}

export default NewNotePage;