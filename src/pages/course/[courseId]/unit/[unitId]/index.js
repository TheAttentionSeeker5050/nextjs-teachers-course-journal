import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// import { getCoursesByUserId } from "@/data/dbTransactions/course.dbTransaction";
import { getCourseByIdWithChildren } from "@/data/dbTransactions/course.dbTransaction";


// import component CourseDashCard and Navbar
import Navbar from '@/components/Navbar';
import DisplayErrorCard from "@/components/DisplayErrorCard";
import AsideCourseMenu from "@/components/AsideCourseMenu";


import { useEffect, useState } from "react";
import SpinnerComponent from "@/components/spinnerComponent";

// here we will also get cookies
export const getServerSideProps = async (context) => {

  // the the x-user-payload from the headers
  const userPayloadStr = context.req.headers['x-user-payload'];

  try {
    // transform the string into an object
    const user = JSON.parse(userPayloadStr);

    // if we can't find the user, we will redirect to the unauthorized page
    // in the future, we will redirect to the login page
    if (!userPayloadStr || !user || !user.userId || !user.email) {
      throw new Error("User not found");
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false,
      },
    }
  }

  // get the course slug
  const { courseId } = context.query;

  try {

    // get the user usign db transaction
    let courseFromDb = await getCourseByIdWithChildren(parseInt(courseId));

    // serialize the course date fields
    courseFromDb.dateCreated = courseFromDb.dateCreated.toString();
    courseFromDb.dateUpdated = courseFromDb.dateUpdated.toString();

    // serialize every field in the units and lessons
    courseFromDb.units = courseFromDb.units.map(unit => {
      unit.dateCreated = unit.dateCreated.toString();
      unit.dateUpdated = unit.dateUpdated.toString();
      unit.lessons = unit.lessons.map(lesson => {
        lesson.dateCreated = lesson.dateCreated.toString();
        lesson.dateUpdated = lesson.dateUpdated.toString();
        return lesson;
      });
      return unit;
    })


    // get unit from query slug
    const { unitId } = context.query;

    // filter the unit from the course
    let selectedUnit = courseFromDb.units.filter(unit => unit.id === parseInt(unitId));

    // if the unit does not exist, return a 404
    if (selectedUnit.length === 0) {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      }
    }


    return {
      props: {
        selectedUnit: selectedUnit[0],
        error: null,
        courseId: courseId,
        course: courseFromDb
      }
    }

  } catch (error) {
    return {
      props: {
        selectedUnit: null,
        error: error.message,
        courseId: null,
        course: null
      }
    }
  }
}

export default function SingleCourse(
  props
) {

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
        {"Course - " + props.course?.courseName || props.error || "Course Page"}
      </h1>

      {/* if props.error, have a button go back to page "/" */}
      {props.error !== null ?
        <DisplayErrorCard error={props.error} />
        :
        <div className="flex flex-col tablet:flex-row flex-wrap mobile:flex-nowrap justify-between gap-8 px-6 w-full mx-auto max-w-6xl mb-8">
          {/* a section that shows the course details */}
          <AsideCourseMenu courseId={props.courseId} course={props.course} selectedUnit={props.selectedUnit?.unitNumber} selectedLesson={null} />

          {/* a section that shows the content of the lesson */}
          <section className="flex flex-col gap-4 px-4 py-3 rounded-md border-primary-500 w-full border-2">
            <h2 className="text-secondary-title-size font-semibold text-primary-600">
              {props.selectedUnit?.unitName || "Unit Name"}
            </h2>

            {/* show buttons edit and delete lesson wrap it with div */}
            <div className="flex gap-3">
              <button className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-md mobile:w-fit">
                <Link href={`/course/${props.courseId}/lesson/new`}>
                  Add a new lesson
                </Link>
              </button>
              <button
                className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-md mobile:w-fit">
                <Link href={`/course/${props.courseId}/unit/${props.selectedUnit?.id}/edit`}>
                  {/* <Link href={`/course/${props.courseId}/lesson/`}> */}
                  Edit Unit
                </Link>
              </button>
              <button
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md mobile:w-fit">
                <Link href={`/course/${props.courseId}/unit/${props.selectedUnit?.id}/delete`}>
                  Delete Unit
                </Link>
              </button>
            </div>

            {/* make a list with the unit lesson name and number */}
            <ul className="flex flex-col gap-2 my-3">
              {props.selectedUnit?.lessons.map((lesson, i) => (
                <li key={i} className="flex flex-col gap-3">
                  <h3 className="text-tertiary-title-size font-semibold text-slate-800 hover:text-slate-600">
                    <Link href={`/course/${props.courseId}/lesson/${lesson.lessonNumber}`}>
                      Lesson {lesson.lessonNumber} - {lesson.lessonName}
                    </Link>
                  </h3>
                </li>
              ))}
            </ul>
          </section>
        </div>
      }
    </main>
  );
}
