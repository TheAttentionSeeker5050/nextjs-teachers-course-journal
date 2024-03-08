import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });


// import component CourseDashCard and Navbar
import Navbar from '@/components/Navbar';
import DisplayErrorCard from "@/components/DisplayErrorCard";

// the db transaction functions
import { getUnitById } from "@/data/dbTransactions/unit.dbTransaction";
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";

// import the validation functions
import { isNotEmpty, isNotUndefined, isSanitizedStringZod } from "@/utils/validation/validationAll";
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";


import { useEffect, useState } from "react";
import SpinnerComponent from "@/components/spinnerComponent";


export async function getServerSideProps(ctx) {

    // get the unit and course from the database using the unitId and courseId url parameters
    const unitId = ctx.params.unitId;
    const courseId = ctx.params.courseId;

    // if the unitId is not a number, return redirect not found
    if (isNaN(unitId) || !parseInt(unitId) || isNaN(courseId) || !parseInt(courseId)) {
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        }
    }

    // attampt to search the unit and verify if it exists and user has permission to edit it
    try {

        // search the course from the database
        const courseFromDB = await getCourseById(parseInt(courseId));

        // get the user payload from the headers x-user-payload
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

        // search the database for the unit with the unitId
        const unitFromDB = await getUnitById(parseInt(unitId));
        
        // parse the dates to string from the unit
        unitFromDB.dateCreated = unitFromDB.dateCreated.toString();
        unitFromDB.dateUpdated = unitFromDB.dateUpdated.toString();

        return {
            props: {
                error: null,
                unit: unitFromDB,
                courseId: courseId,
                unitCount: courseFromDB._count.units
            }
        }

    } catch (error) {
        return {
            props: {
                error: error.message,
                unit: null,
                courseId: courseId,
                unitCount: 0
            }
        }
    }
}

export default function EditUnit(
    props
) {
    const [error, setError] = useState(props.error);
    const [message, setMessage] = useState(null);

    const router = useRouter();

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

            // validate if the unit number is not greater than the unit count
            if (parseInt(formObject.unitNumber) > props.unitCount) {
                throw new Error("Unit number is greater than the unit count");
            }

            // make the request to the server
            const res = await fetch(`/api/course/${props.courseId}/unit/${props.unit.id}/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formObject)
            });

            // if the response is ok, redirect to the course page
            if (res.ok) {                
                // redirect to the course page index
                setMessage("Unit was edited successfully");
                setTimeout(() => {
                    setMessage(null);
                    router.push(`/course/${props.courseId}/unit/${props.unit.id}`);
                } , 4*1000);
            } else {
                throw new Error("There was an error editing the unit");
            }

        }   catch (error) {
            setError(error.message);
        }
    }

    // use effect on error message change
    useEffect(() => {
        // after 3 seconds, remove the error message
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
        <main className={`${inter.className} flex flex-col items-baseline min-h-screen gap-5`} >

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
                {"Edit Course - " + props.course?.courseName || "Edit Course"}
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
                The form to edit an unit
                method: POST
                endpoint: /api/course/[courseId]/unit/[unitId]/edit
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
                    defaultValue={props.unit?.unitName}
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
                    defaultValue={props.unit?.unitNumber}
                >
                    {Array.from({length: props.unitCount}, (_, i) => i + 1).map((num, i) => (
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
                    Edit Unit
                </button>

                <Link href={`/course/${props.courseId}`} className="p-2 bg-slate-600 rounded-lg flex-grow">
                    Cancel
                </Link>
            </div>
            </form>
        </main>
    )
}
