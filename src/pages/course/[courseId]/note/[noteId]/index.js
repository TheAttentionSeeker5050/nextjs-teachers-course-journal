import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { Inter } from "next/font/google";
import CustomEditor from "@/components/editorComponent";
import { getNoteById } from '@/data/dbTransactions/note.dbTransaction';
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";
import Link from 'next/link';


const inter = Inter({ subsets: ["latin"] });

export default function indexPage(props) {

    // navigation and page status states and hooks
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [error, setError] = useState(props.error);

    return (
        <div>
            <Navbar isLoggedIn={true} />
            <div className={`${inter.className} min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8`}>
                <div className="max-w-3xl mx-auto flex flex-col gap-8 py-4">
                    <h1 className="text-main-title-size font-semibold text-primary-600 text-center mt-3 px-5 w-full text-center text-ellipsis break-words">Edit Note</h1>
                    {error && <p className="text-red-500">{error}</p>}
                    <p className='text-lg font-semibold text-primary-600 text-center mt-3 px-5 w-full text-center text-ellipsis break-words'>Note Title</p>
                    {
                        props.note ? 
                            <div className="lesson-list-wrapper"  dangerouslySetInnerHTML={{__html: props.note.note}}></div> 
                        : 
                            <p className="text-red-500">Failed to fetch note</p>
                    }

                    <div className='flex gap-4 justify-stretch text-center'>
                        <Link href={`/course/${props.courseId}/note/${props.noteId}/edit`} 
                            className="bg-primary-500 text-white px-4 py-2 mr-3 rounded-md hover:bg-primary-600 focus:outline-none focus:bg-primary-600 grow">
                            {loading ? 'Updating...' : 'Update Note'}
                        </Link>
                        <Link href={`/course/${props.courseId}/lesson/${props.lessonId}`}
                            className="bg-gray-500 text-white px-4 py-2 p-4 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 grow">Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { courseId, noteId } = context.params;

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
                    destination: validationResult || "/unauthorized",
                    permanent: false
                }
            }
        }

    } catch (error) {
        return {
            redirect: {
                destination: "/unauthorized",
                permanent: false
            }
        }
    }
    
    try {
        // Fetch the note data using the noteId
        const note = await getNoteById(parseInt(noteId));
        // Return the props with the note data
        return {
            props: {
                courseId: courseId,
                noteId: noteId,
                note: note,
                lessonId: note.lessonId,
                error: null

            }
        };
    } catch (error) {
        // In case of an error
        return {
            props: {
                courseId: courseId,
                noteId: noteId,
                note: null,
                lessonId: null,
                error: 'Failed to fetch note'
            }
        };
    }
}