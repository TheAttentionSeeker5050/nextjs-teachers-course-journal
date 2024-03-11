import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });


// import component CourseDashCard and Navbar
import Navbar from '@/components/Navbar';

import { useEffect, useState } from "react";
import SpinnerComponent from "@/components/spinnerComponent";
import { useRouter } from "next/router";

// import the getLessonsForUnit function
import { getLessonsForUnit } from "@/data/dbTransactions/lesson.dbTransaction";

// import the tinyMCE editor
import React, { useRef } from 'react';
// import { Editor } from '@tinymce/tinymce-react';
import CustomEditor from "@/components/editorComponent";

// import the validation functions
import { isNotEmpty, isNotUndefined, isSanitizedStringZod } from "@/utils/validation/validationAll";
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";




export default function NewLesson(props) {

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        // do something
        setMessage("Lesson created successfully");

        // get the body of the form
        const formData = new FormData(e.target);
        const formDataObj = {
            lessonName: formData.get("lessonName").toString(),
            lessonNumber: formData.get("lessonNumber").toString(),
            completedStatus: formData.get("completedStatus").toString(),
            expectedOutcomes: expectedOutcomesEditorRef.current.getContent().toString(),
            assessment: assessmentEditorRef.current.getContent().toString(),
            unitId: formData.get("unitId").toString()
        }
        
        // clean and validate the form data
        try {
            if (!isNotEmpty(formDataObj.lessonName)) {
                throw new Error("Lesson Name is required");
            }
            if (!isNotEmpty(formDataObj.lessonNumber)) {
                throw new Error("Lesson Number is required");
            }
            if (!isNotEmpty(formDataObj.completedStatus)) {
                throw new Error("Completed Status is required");
            }
            if (!isNotEmpty(formDataObj.expectedOutcomes)) {
                throw new Error("Expected Outcomes is required");
            }
            if (!isNotEmpty(formDataObj.assessment)) {
                throw new Error("Assessment is required");
            }
            if (!isSanitizedStringZod(formDataObj.lessonName)) {
                throw new Error("Lesson Name is not valid");
            }
            if (!isSanitizedStringZod(formDataObj.completedStatus)) {
                throw new Error("Completed Status is not valid");
            }
            if (!isSanitizedStringZod(formDataObj.expectedOutcomes)) {
                throw new Error("Expected Outcomes is not valid");
            }
            if (!isSanitizedStringZod(formDataObj.assessment)) {
                throw new Error("Assessment is not valid");
            }

            // attempt to fetch the data to the server
            const response = await fetch(`/api/course/${props.courseId}/lesson/new`, {
                method: "POST",
                body: JSON.stringify(formDataObj),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // if the response is not ok, throw an error
            if (!response.ok) {
                throw new Error("There was a problem creating the lesson, please try again later");
            }

            // if the response is ok, redirect to the unit page
            router.push(`/course/${props.courseId}/unit/${props.unitId}`);

        } catch (error) {
            setError(error.message);
        }



        setIsLoading(false);
    }
    
    
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
            New Lesson for Unit {props.unitId}
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

        {/*
            the form to create a new lesson
         */}
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 mx-auto"
        >
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
                className="border border-primary-600 rounded-md px-3 py-2"
                defaultValue={props.defaultLessonNumber}
            >
                {[...Array(parseInt(props.defaultLessonNumber)).keys()].map((number) => {
                    return (
                        <option
                            key={number}
                            value={number + 1}
                        >
                            {number + 1}
                        </option>
                    )
                })}
            </select>

            <label
                htmlFor="completedStatus"
                className="text-primary-600"
            >
                Completed Status
            </label>
            <select
                name="completedStatus"
                id="completedStatus"
                className="border border-primary-600 rounded-md px-3 py-2"
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
            />

            <input
                type="hidden"
                name="unitId"
                value={props.unitId}
            />


            <button
                type="submit"
                className="mt-3 bg-primary-600 text-white px-3 py-2 rounded-md"
            > 
                Create Lesson
            </button>    
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
    const unitId = ctx.query.unitId;

    // verify the user is owner of the course
    // using our validateCourseOwnership function
    
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
        // get the number of lessons to determine the last index
        const lessons = await getLessonsForUnit(parseInt(unitId));
        const lessonNumber = lessons.length + 1;

        return {
            props: {
                apiKey: apiKey,
                error: null,
                courseId: courseId,
                unitId: unitId,
                defaultLessonNumber: lessonNumber
            }
        }
    } catch (error) {
        return {
            props: {
                apiKey: apiKey,
                error: error.message,
                courseId: courseId,
                unitId: unitId
            }
        }
    }
}