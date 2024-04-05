import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
import CustomEditor from "@/components/editorComponent";
import { getNoteById } from '@/data/dbTransactions/note.dbTransaction';

const inter = Inter({ subsets: ["latin"] });

const EditNotePage = ({ courseId, noteId, note, error, lessonId }) => {
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Ref for TinyMCE editor
    const noteContentEditorRef = useRef(null);

    // Set note title and content from the fetched note data
    useState(() => {
        if (note) {
            setNoteTitle(note.title);
            setNoteContent(note.note);
        }
    }, [note]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate note title
            if (!noteTitle.trim()) {
                throw new Error('Note title is required');
            }

            // Get note content from TinyMCE editor
            const content = noteContentEditorRef.current.getContent();

            // Send request to update note
            const response = await fetch(`/api/course/${courseId}/note/${noteId}/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: noteTitle, content }),
            });

            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Failed to update note');
            }

            // Redirect to note page after updating
            router.push(`/course/${courseId}/lesson/${lessonId}`);
        } catch (error) {
            console.error('Error updating note:', error);
            // Set error state if update fails
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
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Edit Note</h1>
                    {error && <p className="text-red-500">{error}</p>}
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                        <div className="mb-4">
                            <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700">Note Title:</label>
                            <input
                                id="noteTitle"
                                type="text"
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                className="mt-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 px-3 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700">Note Content:</label>
                            {/* TinyMCE Editor */}
                            <CustomEditor
                                apiKey={process.env.TINYMCE_API_KEY}
                                fieldName="noteContent"
                                editorRef={noteContentEditorRef}
                                initialValue={noteContent}
                            />
                        </div>
                        <button type="submit" className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:bg-primary-600" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Note'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    const { courseId, noteId } = context.params;
    try {
        // Fetch the note data using the noteId
        const note = await getNoteById(parseInt(noteId));
        // Return the props with the note data
        return {
            props: {
                courseId: courseId,
                noteId: noteId,
                note: note,
                lessonId: note.lessonId
            }
        };
    } catch (error) {
        console.error('Error fetching note:', error);
        // In case of an error
        return {
            props: {
                courseId: courseId,
                noteId: noteId,
                note: null,
                error: 'Failed to fetch note'
            }
        };
    }
}

export default EditNotePage;



