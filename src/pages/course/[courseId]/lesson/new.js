import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });


// import component CourseDashCard and Navbar
import Navbar from '@/components/Navbar';

import { useEffect, useState } from "react";
import SpinnerComponent from "@/components/spinnerComponent";
import { useRouter } from "next/router";


export default function newPage(props) {

    // the isLoading state variable
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    const [error, setError] = useState(props.error);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            // do something
            setMessage("Lesson created successfully");
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
            New Lesson
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
            form body:
            - lessonName: string
            - lessonNumber: integer
            - completedStatus: text defaults to not prepped, select options: not prepped, prepped, done
            - epectedOutcomes: tinyMCE editor text
            - assessment: tinyMCE editor text
            - unitId hidden input
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
            <input
                type="number"
                name="lessonNumber"
                id="lessonNumber"
                className="border border-primary-600 rounded-md px-3 py-2"
            />

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
    return {
        props: {
            
        }
    };
}