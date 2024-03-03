import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import DisplayErrorCard from "@/components/DisplayErrorCard";
import { getCourseByIdWithChildren } from "@/data/dbTransactions/course.dbTransaction";
import { isNotEmpty, isNotUndefined, isSanitizedStringZod } from "@/utils/validation/validationAll";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });



export const getServerSideProps = async (ctx) =>  {

    // get the course id from url param slug
    const { courseId } = ctx.query;

    // find all the course units to find the size of the array
    // this way we will define the last unit number add one up and set it as the default value
    // for the new unit number
    const course = await getCourseByIdWithChildren(parseInt(courseId));
    const defaultNewUnitNumber = course.units.length + 1;
    // console.log(defaultNewUnitNumber);

    
    return {
        props: {
            error: null,
            courseId: parseInt(courseId),
            defaultNewUnitNumber: defaultNewUnitNumber
        }
    }
}

export default function NewUnit(
    props
) {
    const router = useRouter();
    const [error, setError] = useState(null);

    // on submit form, we will send a POST request to the server
    const handleSubmit = async (e) => {
        e.preventDefault();

        // get the form data from fields
        const formData = new FormData(e.target);
        const formObject = {
            unitName: formData.get("unitName"),
            unitNumber: formData.get("unitNumber"),
            courseId: formData.get("courseId")
        }

        try {
            // validate the unit name is sanitized string
            if (!isSanitizedStringZod(formObject.unitName) || formObject.unitName.length > 50 || !isNotEmpty(formObject.unitName) || !isNotUndefined(formObject.unitName)) {
                throw new Error("Unit name is not valid");
            }

            if (!formObject.unitNumber) {
                throw new Error("Unit number is required");
            }

            if ( parseInt(formObject.unitNumber) > props.defaultNewUnitNumber) {
                throw new Error("Unit number is not valid, please make sure that is not greater than the last unit number + 1");
            }

            // make the fetch request
            const res = await fetch(`/api/course/${props.courseId}/unit/new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formObject)
            });

            // if the response is ok, redirect to the course page
            if (res.ok) {
                alert("Unit created successfully");
            } else {
                throw new Error("There was an error creating the unit");
            }
        } catch (e) {
            setError(e.message);
        }
    }

    // use effect on error message change
    useEffect(() => {
        // after 3 seconds, remove the error message
        setTimeout(() => {
            setError(null);
        }, 8*1000);

    }, [error]);
    return (
        <main
      className={`${inter.className} flex flex-col items-baseline min-h-screen gap-5`}
    >
      {/* 
        because we would not be in this page otherwise, have the isLoggedIn 
        property set as true in this page, if no value is passed, it will default to undefined
        which will keep the login and register buttons as if it was set to false 
      */}
      <Navbar isLoggedIn={true} />

      <h1 className="text-main-title-size font-semibold text-primary-600 text-center my-3 px-5 w-full text-center text-ellipsis break-words">
        New Unit
      </h1>

      {error && 
        <p className="text-red-600 text-center mx-auto">
            {error}
        </p>
      }

      {/* 
        The form to submit create a new unit
        type: POST
        endpoint: /api/course/[courseId]/unit/new
        arguments:
        unitName: string
        unitNumber: number
        courseId: number hidden input
      */}

        <form
            // action={`/api/course/${props.courseId}/unit/new`}
            // method="POST"
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 mx-auto"
        >
            <label
                htmlFor="unitName"
                className="text-primary-600"
            >
                Unit Name
            </label>
            <input
                type="text"
                name="unitName"
                id="unitName"
                className="p-2 border-2 border-primary-600 rounded-md"
                max={50}
            />

            <label
                htmlFor="unitNumber"
                className="text-primary-600"
            >
                Unit Number
            </label>
            <select
                name="unitNumber"
                id="unitNumber"
                className="p-2 border-2 bg-slate-100 border-primary-600 rounded-md"
                // value={props.defaultNewUnitNumber}
            >
                {Array.from({length: props.defaultNewUnitNumber}, (_, i) => i + 1).map((num, i) => (
                    <option
                        key={i}
                        value={num}
                    >
                        {num}
                    </option>
                ))}
            </select>

            <input
                type="hidden"
                name="courseId"
                value={props.courseId}
            />

            <button
                type="submit"
                className="p-2 bg-primary-600 text-white rounded-lg w-1/2 mx-auto"
            >
                Create Unit
            </button>
        </form>
      </main>
    );
}