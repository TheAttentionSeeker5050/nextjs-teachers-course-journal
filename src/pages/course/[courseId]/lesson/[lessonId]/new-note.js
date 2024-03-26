import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
import { createNewNote } from '@/data/dbTransactions/note.dbTransaction';

const inter = Inter({ subsets: ["latin"] });

const NewNotePage = ({ courseId, lessonId }) => {
    const [noteContent, setNoteContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate note content
            if (!noteContent.trim()) {
                throw new Error('Note content is required');
            }

            // Create new note in the database
            await createNewNote(courseId, lessonId, noteContent);

            // Redirect to lesson page after creating the note
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

export default NewNotePage;
