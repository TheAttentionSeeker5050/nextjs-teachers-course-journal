
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// components
import Navbar from '@/components/Navbar';
import DisplayErrorCard from "@/components/DisplayErrorCard";

// react next hooks
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// spinner component
import SpinnerComponent from "@/components/spinnerComponent";
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";
import { getLessonById } from "@/data/dbTransactions/lesson.dbTransaction";


export async function getServerSideProps(context) {

    // get courseId, lessonId, and fileId from the context
    const { courseId, lessonId } = context.query;

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

    try {
        // get lesson data using db transaction method, from here we will just need the name
        const lesson = await getLessonById(parseInt(lessonId));

        return {
            props: {
                courseId,
                lessonId,
                lessonName: lesson.lessonName,
                error: null
            }
        }

    } catch (error) {
        return {
            props: {
                courseId,
                lessonId,
                lessonName: null,
                error: error.message
            }
        }
    }
}

export default function UploadNewFileAttachment(props) {
    // the isLoading state variable
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    const [error, setError] = useState(props.error);
    const [message, setMessage] = useState(null);

    // when the component mounts, set isLoading to false to close loading spinner
    useEffect(() => {
        setIsLoading(false);
    }, []);

    // use a useEffect hook to close the message or error after 3 seconds
    useEffect(() => {
        if (message || error) {
            setTimeout(() => {
                setMessage(null);
                setError(null);
            }, 8*1000);
        }
    }, [message, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        // get the form data
        const formData = new FormData(e.target);
        const formDataObj = {
            userId: formData.get("userId"),
            lessonId: formData.get("lessonId"),
            file: formData.get("file")
        }

        // will attempt to upload the file here
        try {
            // validate the file data
            if (!formDataObj.file) {
                setIsLoading(false);
                setError("File is required!");
                return;
            }

            // validate the userId
            if (!formDataObj.userId) {
                setIsLoading(false);
                setError("User ID is required!");
                return;
            }

            // validate the lessonId
            if (!formDataObj.lessonId) {
                setIsLoading(false);
                setError("Lesson ID is required!");
                return;
            }

            // upload the file, send a POST request to the server
            // url: /api/course/:courseId/file/new-file
            // body: { userId, lessonId, file }
            // file-compatible request: multipart/form-data
            const response = await fetch(
                `/api/course/${props.courseId}/file/new`, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                },
            );

            // if the response is not okay, throw an error
            if (!response.ok) {
                throw new Error("Failed to upload file!");
            }

            // print the json response
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            setMessage("File uploaded successfully!");

            // push to the lesson page  
            router.push(`/course/${props.courseId}/lesson/${props.lessonId}`);
            
        } catch (error) {
            setIsLoading(false);
            setError(error.message);
        }

        
        // timeout to simulate server response
        setTimeout(() => {
            setIsLoading(false);
            setMessage("File uploaded successfully!");
            // router.push(`/course/${props.courseId}/lesson/${props.lessonId}`);
        }, 3000);
    }

    return (
        <main
        className={`${inter.className} flex flex-col items-center min-h-screen gap-4`}>
            <Navbar isLoggedIn={true} />

            {isLoading === true &&
                <SpinnerComponent isLoadingState={isLoading} />
            }

            <h1 className="text-main-title-size font-semibold text-primary-600 text-center mt-3 px-5 w-full text-center text-ellipsis break-words">
                {/* {"Course - " + props.course?.courseName || props.error || "Lesson Page"} */}
                {`Upload File Attachment`}
            </h1>

            <h2 className="text-sub-title-size font-semibold text-primary-600 text-center px-5 w-full text-center text-ellipsis break-words">
                {`Lesson Name: ${'Lesson Name'}`}
            </h2>

            {error && 
                <p className="text-red-600 text-center mx-auto">
                    {error}
                </p>
            }

            {message &&
                <p className="text-green-600 text-center mx-auto">
                    {message}
                </p>
            }
            
            {/* form to upload file */}
            <form 
                className="flex flex-col gap-4 max-w-2xl w-full"
                onSubmit={handleSubmit}
                >

                {/* hidden input for userId */}
                <input
                    type="hidden"
                    name="userId"
                    value="userId"
                />

                {/* hidden input for lessonId */}
                <input
                    type="hidden"
                    name="lessonId"
                    value="lessonId"
                />
                
                {/* file input */}
                <label
                    htmlFor="file"
                    className="text-primary-600"
                >
                    File Attachment
                </label>
                <input
                    type="file"
                    name="file"
                    id="file"
                    className="border-2 border-primary-600 rounded-md px-2 py-1 w-full"
                />

                {/* submit button */}
                <div className="flex gap-3 justify-stretch text-white my-4 text-center">
                    <button
                        type="submit"
                        className="p-2 bg-primary-600 rounded-lg flex-grow">
                        Upload File
                    </button>

                    <Link 
                        href={`/course/${props.courseId}/lesson/${props.lessonId}`}
                        className="p-2 bg-slate-600 rounded-lg flex-grow"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </main>
    )
}

