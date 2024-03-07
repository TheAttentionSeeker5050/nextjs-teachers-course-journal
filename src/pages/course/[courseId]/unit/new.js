import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";
import { isNotEmpty, isNotUndefined, isSanitizedStringZod } from "@/utils/validation/validationAll";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";


import { useEffect, useState } from "react";
import SpinnerComponent from "@/components/spinnerComponent";

const inter = Inter({ subsets: ["latin"] });



export const getServerSideProps = async (ctx) =>  {

    

    // get the course id from url param slug
    const { courseId } = ctx.query;

    if (!courseId) {
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        }
    }

    try {
        // get the default new unit number
        const courseFromDB = await getCourseById(parseInt(courseId));

        // get the user payload from the headers x-user-payload and parse it
        const userPayloadStr = ctx.req.headers["x-user-payload"];

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

        const defaultNewUnitNumber = courseFromDB._count.units + 1;
        
        return {
            props: {
                error: null,
                courseId: parseInt(courseId),
                defaultNewUnitNumber: defaultNewUnitNumber
            }
        }

    } catch (e) {
        return {
            props: {
                error: e.message,
                courseId: parseInt(courseId),
                defaultNewUnitNumber: null
            }
        }
    }
}

export default function NewUnit(
    props
) {
    const router = useRouter();

    const [error, setError] = useState(props.error);
    const [message, setMessage] = useState(null);

    // on submit form, we will send a POST request to the server
    const handleSubmit = async (e) => {
        e.preventDefault();

        // get the form data from fields
        const formData = new FormData(e.target);
        const formObject = {
            unitName: formData.get("unitName"),
            unitNumber: formData.get("unitNumber")
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
                // redirect to the course page index
                setMessage("Unit was created successfully");
                setTimeout(() => {
                    setMessage(null);
                    router.push(`/course/${props.courseId}`);
                } , 4*1000);
            } else {
                // if the response status code is 401 unauthorized, go redirect to the 401
                if (res.status === 401) {
                    router.push("/unauthorized")
                } 
                throw new Error("There was an error creating the unit");
            }
        } catch (e) {
            setError(e.message);
        }
    }

    // use effect on error message change
    useEffect(() => {
        // after 8 seconds, remove the error message
        setTimeout(() => {
            setError(null);
        }, 8*1000);

    }, [error]);

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
            New Unit
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
        The form to submit create a new unit
        type: POST
        endpoint: /api/course/[courseId]/unit/new
        arguments:
        unitName: string
        unitNumber: number
      */}

        <form
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
                defaultValue={props.defaultNewUnitNumber}
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

            <div className="flex gap-3 justify-stretch text-white  my-4 text-center">
                <button
                    type="submit"
                    className="p-2 bg-primary-600 rounded-lg flex-grow"
                >
                    Create Unit
                </button>

                <Link href={`/course/${props.courseId}`} className="p-2 bg-slate-600 rounded-lg flex-grow">
                    Cancel
                </Link>
            </div>
        </form>
      </main>
    );
}