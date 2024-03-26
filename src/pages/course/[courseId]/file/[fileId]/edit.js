
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

// prisma client
import prisma from "@/data/prisma";


export async function getServerSideProps(context) {

    // get courseId, lessonId, and fileId from the context
    const { courseId, fileId} = context.query;

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
        // get the file record from the database
        const fileRecord = await prisma.fileUpload.findUnique({
            where: {
                id: parseInt(fileId),
            },
            include: {
                lesson: {
                    select: {
                        id: true,
                        lessonName: true,
                        lessonNumber: true,
                    }
                }
            },
        });

        return {
            props: {
                courseId,
                fileRecord: fileRecord,
            }
        }

    } catch (error) {
        return {
            props: {
                courseId,
                fileRecord: null,
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

    // form data state
    const [file, setFile] = useState(null);

    // handler for file change
    const handleFileChange = (e) => {
        setIsLoading(true)
        setFile(e.target.files[0])
        setIsLoading(false);
    }

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
        const formData = new FormData();
        // formData.append("userId", props.userId);
        formData.append("file", file);

        // will attempt to upload the file here
        try {
            // validate the file data
            if (!formData.get("file")) {
                throw new Error("File is required!");
            }

            // upload the file, send a POST request to the server
            const response = await fetch(
                `/api/course/${props.courseId}/file/${props.fileRecord?.id}/edit`, {
                    method: "POST",
                    body: formData
                },
            );

            // print the json response
            const jsonResponse = await response.json();
            
            // if user is unauthorized, redirect to 401
            if (response.status === 401) {
                await router.push("/unauthorized");
                return
            }

            // if the response is not okay, throw an error
            if (!response.ok) {
                throw new Error(jsonResponse.error);
            }
            
            setIsLoading(false);

            setMessage("File updated successfully!");

            // push to the lesson page  
            await router.push(`/course/${props.courseId}/lesson/${props.fileRecord?.lesson?.id}`);
            
        } catch (error) {
            setIsLoading(false);
            setError(error.message);
        }
    }

    return (
        <main
        className={`${inter.className} flex flex-col items-center min-h-screen gap-4`}>
            <Navbar isLoggedIn={true} />

            {isLoading === true &&
                <SpinnerComponent isLoadingState={isLoading} />
            }

            <h1 className="text-main-title-size font-semibold text-primary-600 text-center mt-3 px-5 w-full text-center text-ellipsis break-words">
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
                    value={props.fileRecord?.userId}
                />

                {/* hidden input for lessonId */}
                <input
                    type="hidden"
                    name="lessonId"
                    value={props.fileRecord?.lesson?.id}
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
                    onChange={handleFileChange}
                    id="file"
                    className="border-2 border-primary-600 rounded-md px-2 py-1 w-full"
                />

                {/* submit button */}
                <div className="flex gap-3 justify-stretch text-white my-4 text-center">
                    <button
                        type="submit"
                        className={`p-2 bg-primary-600 rounded-lg flex-grow ${!file || isLoading ? "cursor-not-allowed bg-gray-400" : "cursor-pointer"}`}
                        disabled={!file || isLoading}
                        >
                        Re-Upload File
                    </button>

                    <Link 
                        href={`/course/${props.courseId}/lesson/${props.fileRecord?.lesson?.id}`}
                        className="p-2 bg-slate-600 rounded-lg flex-grow"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </main>
    )
}

