// import react libraries
import { useEffect, useState } from "react";
import React, { useRef } from 'react';
import { useRouter } from "next/router";

import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// import components
import Navbar from '@/components/Navbar';
import SpinnerComponent from "@/components/spinnerComponent";
import AsideCourseMenu from "@/components/AsideCourseMenu";
import DisplayErrorCard from "@/components/DisplayErrorCard";
import CustomEditor from "@/components/editorComponent";

// import database methods
import { getLessonById } from "@/data/dbTransactions/lesson.dbTransaction";
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import prisma from "@/data/prisma";

// validation
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";


export default function EditLesson(props) {
    // the isLoading state variable
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    const [error, setError] = useState(props.error);
    const [message, setMessage] = useState(null);

    // the tinyMCE editor reference hook
    const assessmentEditorRef = useRef(null);
    const expectedOutcomesEditorRef = useRef(null);

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
                { "Edit Lesson - " + props.lesson?.lessonName || "Edit Lesson" }
            </h1>

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
            
            <form
                method="POST"
                action={`/api/course/${props.courseId}/lesson/${props.lesson?.id}/edit`}
                className="flex flex-col gap-3 mx-auto"
            >
                {/* 
                    The form to edit a lesson
                    method: POST
                    endpoint: /api/course/[courseId]/lesson/[lessonId]/edit
                    request body:
                        lessonName: string
                        lessonNumber: number
                        completionStatus: string select: "prepped", "not prepped", "done"
                        expectedOutcome: string wsywig
                        assessment: string wsywig
                        unitId: hidden input
                */}
                <label
                    htmlFor="lessonName"
                    className="text-primary-600"
                > 
                    Lesson Name
                </label>
                <input
                    type="text"
                    name="lessonName"
                    id="lessonName"
                    defaultValue={props.lesson?.lessonName}
                    className="border border-primary-600 rounded-md px-3 py-2"
                />

                <label
                    htmlFor="lessonNumber"
                    className="text-primary-600"
                >
                    Lesson Number
                </label>
                <select
                    name="lessonNumber"
                    id="lessonNumber"
                    defaultValue={props.lesson?.lessonNumber}
                    className="p-2 rounded-lg"
                >
                    {/* iterate through all the lesson numbers */}
                    {[...Array(parseInt(props.lessonLastIndex)).keys()].map((number) => {
                        return (
                            <option
                                key={number}
                                value={number + 1}
                            >
                                {number + 1}
                            </option>
                        )
                    }
                    )}
                </select>

                <label
                    htmlFor="completionStatus"
                    className="text-primary-600"
                >
                    Completion Status
                </label>
                <select
                    name="completionStatus"
                    id="completionStatus"
                    defaultValue={props.lesson?.completionStatus}
                    className="p-2 rounded-lg"
                >
                    <option value="not prepped">Not Prepped</option>
                    <option value="prepped">Prepped</option>
                    <option value="done">Done</option>
                </select>

                <label
                htmlFor="expectedOutcomes"
                className="text-primary-600"
                >
                    Expected Outcomes
                </label>
                <CustomEditor
                    apiKey={props.apiKey}
                    fieldName="expectedOutcomes"
                    editorRef={expectedOutcomesEditorRef}
                    // have default value set to lesson.expectedOutcomes
                    initialValue={props.lesson?.expectedOutcomes}
                />

                <label
                    htmlFor="assessment"
                    className="text-primary-600"
                >
                    Assessment
                </label>
                <CustomEditor
                    apiKey={props.apiKey}
                    fieldName="assessment"
                    editorRef={assessmentEditorRef}
                    // have default value set to lesson.assessment
                    initialValue={props.lesson?.assessment}
                />

                <input
                    type="hidden"
                    name="unitId"
                    value={props.lesson?.unitId}
                />
                

                <div className="flex gap-3 justify-stretch text-white my-4 text-center">
                    <button type="submit" className="p-2 bg-primary-600 rounded-lg flex-grow">
                        Submit
                    </button>
                    <Link href={`/course/${props.courseId}`} className="p-2 bg-slate-600 rounded-lg flex-grow">
                        Cancel
                    </Link>
                </div>

            </form>

        </main>
    )
}

export async function getServerSideProps(ctx) {
    // get the tinyMCE editor api key
    const apiKey = process.env.TINYMCE_API_KEY;

    // get the course id from the url slug /course/1
    const courseId = ctx.query.courseId;

    // get the unit id
    const lessonId = ctx.query.lessonId;
    let lessonCount = 0;

    try {
        const course = await getCourseById(parseInt(courseId))
        const userPayloadStr = ctx.req.headers["x-user-payload"];

        const validationResult = await validateCourseOwnership(course, userPayloadStr);
        
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
        const lesson = await getLessonById(parseInt(lessonId));
        
        // get the count of lessons from the unit id from lesson
        lessonCount = await prisma.lesson.count({
            where: {
                unitId: lesson.unitId
            }
        });
        

        // parse the dates to string on lesson object
        lesson.dateCreated = lesson.dateCreated.toString();
        lesson.dateUpdated = lesson.dateUpdated.toString();

        return {
            props: {
                error: null,
                lesson: lesson,
                apiKey: process.env.TINYMCE_API_KEY,
                courseId: parseInt(courseId),
                lessonLastIndex: lessonCount
            }
        }
    } catch (error) {
        return {
            props: {
                error: "An error occured, please try again",
                lesson: null,
                apiKey: process.env.TINYMCE_API_KEY,
                courseId: null,
                lessonLastIndex: 0
            }
        }
    }
}