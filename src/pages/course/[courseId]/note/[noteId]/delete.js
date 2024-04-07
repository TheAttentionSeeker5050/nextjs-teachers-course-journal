import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
import { getNoteById } from '@/data/dbTransactions/note.dbTransaction';

const inter = Inter({ subsets: ["latin"] });

const DeleteNotePage = ({ initialNote, courseId, lessonId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleDelete = async () => {
        // Logic to delete the note via API
        try {
            setLoading(true);
            const response = await fetch(`/api/course/${courseId}/note/${initialNote.id}/delete`, {
                method: 'DELETE',
            });
            if (response.ok) {
                router.push(`/course/${courseId}/lesson/${lessonId}`);
            } else {
                setError('Failed to delete note');
            }
        } catch (error) {
            setError('Error deleting note: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar isLoggedIn={true} />
            <div className={`${inter.className} min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8`}>
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Delete Note</h1>
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                        <div>
                            <p className="mb-4">Are you sure you want to delete the note <span className="font-semibold text-red-500">{initialNote.title}</span>?</p>
                            <div className="flex gap-3 justify-stretch text-white my-4 text-center">
                                <button onClick={handleDelete} className="p-2 bg-primary-600 rounded-lg flex-grow">
                                    Delete
                                </button>
                                <button onClick={() => router.push(`/course/${courseId}/lesson/${lessonId}`)} className="p-2 bg-slate-600 rounded-lg flex-grow">
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
    const { courseId, noteId } = context.params;
    try {
        const initialNote = await getNoteById(parseInt(noteId));
        return {
            props: {
                initialNote,
                lessonId: initialNote.lessonId,
                courseId: parseInt(courseId)
            }
        };
    } catch (error) {
        console.error('Error fetching note data:', error);
        return {
            props: {
                initialNote: null,
                lessonId: null,
                courseId: null
            }
        };
    }
}

export default DeleteNotePage;
