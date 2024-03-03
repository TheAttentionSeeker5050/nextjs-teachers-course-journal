import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });


// import component CourseDashCard and Navbar
import Navbar from '@/components/Navbar';
import DisplayErrorCard from "@/components/DisplayErrorCard";
import { getUnitById } from "@/data/dbTransactions/unit.dbTransaction";
import { getCourseById } from "@/data/dbTransactions/course.dbTransaction";



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
                    <p className="text-center mx-auto">
                        Are you sure you want to delete <span className="font-semibold text-red-500">
                            {props.unit.unitName}
                        </span> ?
                    </p>

                    <div className="flex gap-3 justify-center my-4">
                        <button
                            type="submit"
                            className="bg-red-600 text-white p-2 rounded-md"
                        >
                            Delete
                        </button>
                        <Link href={`/course/${props.courseId}`}>
                            <button
                                type="button"
                                className="bg-slate-600 text-white p-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </Link>
                    </div>
                </form>
            }
        </main>
        
    )
}

export async function getServerSideProps(ctx) {

    // get the unit from the database using the unitId url parameter
    const unitId = ctx.params.unitId;
    const courseId = ctx.params.courseId;

    // if the unitId is not a number, return redirect not found
    if (isNaN(unitId) || !parseInt(unitId)) {
        return {
            redirect: {
                destination: "/404",
                permanent: false
            }
        }
    }
        try {
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

        // get the user payload from the headers x-user-payload
        const userPayloadStr = ctx.req.headers["x-user-payload"];
        const user = JSON.parse(userPayloadStr);

        // get the course from database
        const courseFromDB = await getCourseById(unitFromDB.courseId);

        if (!user || !user.userId || !user.email) {
            return {
                redirect: {
                    destination: "/unauthorized",
                    permanent: false
                }
            }
        }

        if (courseFromDB.userId !== user.userId) {
            return {
                redirect: {
                    destination: "/unauthorized",
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