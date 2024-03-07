import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";


import { useEffect, useState } from "react";
import SpinnerComponent from "@/components/spinnerComponent";


const inter = Inter({ subsets: ["latin"] });

// import { getCoursesByUserId } from "@/data/dbTransactions/course.dbTransaction";
import { getCourseByIdWithChildren } from "@/data/dbTransactions/course.dbTransaction";

// here we will also get cookies
export const getServerSideProps = async (ctx) => {

  // the the x-user-payload from the headers
  const userPayloadStr = ctx.req.headers['x-user-payload'];
  
  if (!userPayloadStr) {
    return {
    redirect: {
      destination: '/unauthorized',
      permanent: false,
      },
    }
  }
  

  // transform the string into an object
  const user = JSON.parse(userPayloadStr);

  // if we can't find the user, we will redirect to the unauthorized page
  // in the future, we will redirect to the login page
  if (!user || !user.userId || !user.email) {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false,
      },
    }
  }

  // get the course slug
  const { courseId } = ctx.query;

  try {

    // get the user usign db transaction
    // let courseFromDb = await getCourseById(parseInt(courseId));
    let courseFromDb = await getCourseByIdWithChildren(parseInt(courseId));
    
    // validate if the course exists 
    if (!courseFromDb) {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      }
    }
    

    // verify if the current user owns the course using column userId on course table
    if (courseFromDb.userId !== user.userId) {
      return {
        redirect: {
          destination: '/unauthorized',
          permanent: false,
        },
      }
    }
    
    // we will get the first value only, so we are going to use the first index
    const selectedLesson = courseFromDb.units.reduce((acc, unit) => {
      if (unit.lessons.length > 0) {
        acc.push(unit.lessons[0]);
      }
      return acc;
    }
    , [])[0] || null;

    if (!selectedLesson) {
      throw new Error("No lessons found in this course");
    }

    // serialize the lesson dates
    selectedLesson.dateUpdated = selectedLesson.dateUpdated?.toString() || null;
    selectedLesson.dateCreated = selectedLesson.dateCreated?.toString() || null;

    return { 
      props: {
        course: courseFromDb.id,
        error: null,
        selectedLesson: selectedLesson,
        courseId: parseInt(courseId)
      } 
    }
    
  } catch (error) {
    return {
      props: {
        course: null,
        error: error.message,
        selectedLesson: null,
        courseId: parseInt(courseId)

      }
    }
  }
}

export default function SingleCourse(
    props
) {
  // use useRouter to redirect
  const router = useRouter();

  // wait until the component is mounted to redirect
  useEffect(() => {
    if (!props.selectedLesson) {
      return;
    }
    router.push(`/course/${props.courseId}/lesson/${props.selectedLesson?.id}`);
  } ,[]);
  
  // the isLoading state variable
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, 
  []);
  
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
        {"Course - " + props.course?.courseName || props.error || "Course Page"}
      </h1>

      {/* if props.error, have a button go back to page "/" */}
          <p className="text-center text-md mx-auto">
            {props.error ? props.error : "An error occurred, please try again later"}
          </p>
          {/* add a button to add a new unit */}
          <Link href={`/course/${props.courseId}/unit/new`} className="bg-primary-600 text-white px-3 mx-auto py-2 rounded-md">
            Add a new unit
          </Link>
    </main>
  );
}
