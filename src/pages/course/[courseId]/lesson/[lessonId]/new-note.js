import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
import CustomEditor from "@/components/editorComponent";

const inter = Inter({ subsets: ["latin"] });

const NewNotePage = ({ courseId, lessonId }) => {
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    // the tinyMCE editor reference hook
    const assessmentEditorRef = useRef(null);
    const expectedOutcomesEditorRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate note title
            if (!noteTitle.trim()) {
                throw new Error('Note title is required');
            }

            // Validate note content
            if (!noteContent.trim()) {
                throw new Error('Note content is required');
            }

            // Send a request to the API route to create a new note
            const response = await fetch(`/api/course/${courseId}/note/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: noteTitle,
                    content: noteContent,
                    courseId: courseId,
                    lessonId: lessonId,
                }),
            });

            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Failed to create note');
            }

            // Redirect to the lesson page after creating the note
            router.push(`/course/${courseId}/lesson/${lessonId}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
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
                                    console.log(noteTitle)
                                }}
                                className="mt-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 px-3 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700">Note Content:</label>
                            <textarea
                                id="noteContent"
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                className="mt-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-32 px-3 py-2"
                            />
                        </div>
                        <button type="submit" className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:bg-primary-600" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Note'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    const { courseId, lessonId } = context.params;
    return {
        props: {
            courseId: courseId,
            lessonId: lessonId
        }
    };
}

export default NewNotePage;




