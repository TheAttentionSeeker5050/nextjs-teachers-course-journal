import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });


// import component CourseDashCard and Navbar
import Navbar from '@/components/Navbar';
import DisplayErrorCard from "@/components/DisplayErrorCard";
import { getUnitById } from "@/data/dbTransactions/unit.dbTransaction";
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";

// validation
import { validateCourseOwnership } from "@/utils/validation/validateCourseOwnership";


export async function getServerSideProps(ctx) {

    // get the unit from the database using the unitId url parameter
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
        const unitFromDB = await getUnitById(parseInt(unitId));

        // if the unit is not found, return redirect not found
        if (unitFromDB === null) {
            return {
                redirect: {
                    destination: "/404",
                    permanent: false
                }
            }
        }

        // parse string the dates from from the unit
        unitFromDB.dateCreated = unitFromDB.dateCreated.toString();
        unitFromDB.dateUpdated = unitFromDB.dateUpdated.toString();

        return {
            props: {
                error: null,
                unit: unitFromDB,
                courseId: unitFromDB.courseId,
            }
        }
    } catch (error) {
        return {
            props: {
                error: error.message,
                unit: null,
                courseId: null,
            }
        }
    }
}

export default function DeleteUnit(
    props
) {

    return (
        <main className={`${inter.className} flex flex-col items-baseline min-h-screen gap-5`} >
            {/* 
                because we would not be in this page otherwise, have the isLoggedIn 
                property set as true in this page, if no value is passed, it will default to undefined
                which will keep the login and register buttons as if it was set to false 
            */}
            <Navbar isLoggedIn={true} />

            <h1 className="text-main-title-size font-semibold text-primary-600 text-center my-3 px-5 w-full text-center text-ellipsis break-words">
                {"Delete Unit"}
            </h1>

            {/* if props.error, have a button go back to page "/" */}
            {(props.error !== null && props.error !== undefined) ?
                <DisplayErrorCard error={props.error} />
            :
                
                <form
                    method="POST"
                    action={`/api/course/${props.courseId}/unit/${props.unit.id}/delete`}
                    className="flex flex-col gap-3 mx-auto"
                >
                    {/* 
                        The form to delete a unit
                        method: POST
                        endpoint: /api/course/[courseId]/unit/[unitId]/delete
                        arguments: none
                    */}
                    <p className="text-center mx-auto">
                        Are you sure you want to delete <span className="font-semibold text-red-500">
                            {props.unit.unitName}
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
