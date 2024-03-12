// import react libraries
import { useEffect, useState } from "react";
import React from "react";

import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// import components
import Navbar from '@/components/Navbar';
import SpinnerComponent from "@/components/spinnerComponent";
import DisplayErrorCard from "@/components/DisplayErrorCard";

// import database methods
import { getLessonById } from "@/data/dbTransactions/lesson.dbTransaction";
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";

// validation
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";



export default function DeleteLesson(props) {

    // the isLoading state variable
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
            setIsLoading(false);
    }, []);

    return (
        <main
        className={`${inter.className} flex flex-col items-baseline min-h-screen gap-5`}
        >
            {isLoading === true &&
                <SpinnerComponent isLoadingState={isLoading} />
            }

            {/* 
                because we would not be in this page otherwise, have the isLoggedIn 
                property set as true in this page, if no value is passed, it will default to undefined
                which will keep the login and register buttons as if it was set to false 
            */}
            <Navbar isLoggedIn={true} />

            <h1 className="text-main-title-size font-semibold text-primary-600 text-center my-3 px-5 w-full text-center text-ellipsis break-words">
                { "Delete Lesson - " + props.lesson?.lessonName || "Delete Lesson" }
            </h1>

            {/* if props.error, have a button go back to page "/" */}
            {(props.error !== null && props.error !== undefined) ?
                <DisplayErrorCard error={props.error} />
            :
                <form
                    method="POST"
                    action={`/api/course/${props.courseId}/lesson/${props.lesson?.id}/delete`}
                    className="flex flex-col gap-3 mx-auto"
                >
                    {/* 
                        The form to delete a lesson
                        method: POST
                        endpoint: /api/course/[courseId]/lesson/[lessonId]/delete
                        arguments: none
                    */}
                    <p className="text-center mx-auto">
                        Are you sure you want to delete <span className="font-semibold text-red-500">
                            {props.lesson?.lessonName || "this lesson"}
                        </span> ?
                    </p>

                    <div className="flex gap-3 justify-stretch text-white my-4 text-center">
                        <button
                            type="submit"
                            className="p-2 bg-primary-600 rounded-lg flex-grow"
                        >
                            Delete
                        </button>
                        <Link href={`/course/${props.courseId}`} className="p-2 bg-slate-600 rounded-lg flex-grow">
                            Cancel
                        </Link>
                    </div>

                </form>
            }


        </main>
    )
}

export async function getServerSideProps(ctx) {
    // get the unit from the database using the unitId url parameter
    const lessonId = ctx.params.lessonId;
    const courseId = ctx.params.courseId;

    // if the unitId is not a number, return redirect not found
    if (isNaN(lessonId) || !parseInt(lessonId) || isNaN(courseId) || !parseInt(courseId)) {
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        }
    }

    try {
        // get the user payload from the headers x-user-payload
        const userPayloadStr = ctx.req.headers["x-user-payload"];

        // get the course from database
        const courseFromDB = await getCourseById(parseInt(courseId));

        // validate course ownership
        const courseValidationResult = await validateCourseOwnership(courseFromDB, userPayloadStr);

        // if the courseValidationResult is not null, return redirect
        if (courseValidationResult) {
            return {
                redirect: {
                    destination: courseValidationResult,
                    permanent: false
                }
            }
        }

        // search the database for the unit with the unitId
        const lessonFromDB = await getLessonById(parseInt(lessonId));

        if (lessonFromDB === null) {
            return {
                redirect: {
                    destination: "/404",
                    permanent: false
                }
            }
        }

        // parse string the dates from from the lesson
        lessonFromDB.dateCreated = lessonFromDB.dateCreated.toString();
        lessonFromDB.dateUpdated = lessonFromDB.dateUpdated.toString();

        return {
            props: {
                error: null,
                lesson: lessonFromDB,
                courseId: courseFromDB.id,
            }
        }

    } catch (error) {
        return {
            props: {
                error: error.message,
                lesson: null,
                courseId: null,   
            }
        }
    }
}