import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });


// import component CourseDashCard and Navbar
// import CourseDashCard from '@/components/CourseDashCard';
import Navbar from '@/components/Navbar';
import DisplayErrorCard from "@/components/DisplayErrorCard";


export default function EditUnit(
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
                {"Edit Course - " + props.course?.courseName || "Edit Course"}
            </h1>

            {/* if props.error, have a button go back to page "/" */}
            {(props.error !== null && props.error !== undefined) ?
                <DisplayErrorCard error={props.error} />
                :
                <>Edit Unit</>
            }
        </main>
    )
}

export async function getServerSideProps(ctx) {
    return {
        props: {
            error: null,
        }
    }
}