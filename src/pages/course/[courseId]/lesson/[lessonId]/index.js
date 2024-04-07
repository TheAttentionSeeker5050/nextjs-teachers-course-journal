
import { Inter } from "next/font/google";
import Link from "next/link";

import NoteListElement from "@/components/NoteListElement";

const inter = Inter({ subsets: ["latin"] });

// import { getCoursesByUserId } from "@/data/dbTransactions/course.dbTransaction";
import { getCourseByIdWithChildren } from "@/data/dbTransactions/course.dbTransaction";

import Navbar from '@/components/Navbar';
import FileListElement from "@/components/FileListElement";
import AsideCourseMenu from "@/components/AsideCourseMenu";
import DisplayErrorCard from "@/components/DisplayErrorCard";


import { useEffect, useState } from "react";
import SpinnerComponent from "@/components/spinnerComponent";
import prisma from "@/data/prisma";

// here we will also get cookies
export const getServerSideProps = async (context) => {

  // the the x-user-payload from the headers
  const userPayloadStr = context.req.headers['x-user-payload'];
  
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
  const { courseId } = context.query;

  try {

    // get the user usign db transaction
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

    // convert the date to json serializable string
    courseFromDb.dateCreated = courseFromDb.dateCreated?.toString() || null;
    courseFromDb.dateUpdated = courseFromDb.dateUpdated?.toString() || null;

    // convert the date to json serializable string of the units and lessons
    courseFromDb.units.forEach(unit => {
      unit.dateCreated = unit.dateCreated?.toString() || null;
      unit.dateUpdated = unit.dateUpdated?.toString() || null;
      unit.lessons.forEach(lesson => {
        lesson.dateCreated = lesson.dateCreated?.toString() || null;
        lesson.dateUpdated = lesson.dateUpdated?.toString() || null;
      });
    });

    

    // select selected lesson and unit number from ?a=b query params, default to first lesson of first unit
    let { lessonId } = await context.query;

    if (!lessonId || !parseInt(lessonId) || parseInt(lessonId) < 1) {
        lessonId = "1";
    }

    // search lesson by lesson number
    const selectedLesson = courseFromDb.units?.reduce((acc, unit) => {
        if (acc) {
            return acc;
        }
        return unit.lessons?.filter((l, i) => l.id === parseInt(lessonId))[0] || null;
    }, null);

    if (!selectedLesson) {
      // redirect to 404 page
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      }
    }

    // lookout the files records and notes records using prisma
    const files = await prisma.fileUpload.findMany({
      where: {
        lessonId: parseInt(lessonId)
      }
    });

    const notes = await prisma.note.findMany({
      where: {
        lessonId: parseInt(lessonId)
      }
    });

    return { 
      props: {
        course: courseFromDb,
        error: null,
        selectedLesson: selectedLesson,
        courseId: courseId,
        files: files,
        notes: notes
      } 
    }
    
  } catch (error) {
    return {
      props: {
        course: null,
        error: error.message,
        selectedLesson: null,
        courseId: null,
        files: null,
        notes: null
      }
    }
  }
}

export default function SingleLesson(
    props
) {

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
        <p className="text-center text-2xl text-primary-600">Loading...</p>
      }

      {/* 
        because we would not be in this page otherwise, have the isLoggedIn 
        property set as true in this page, if no value is passed, it will default to undefined
        which will keep the login and register buttons as if it was set to false 
      */}
      <Navbar isLoggedIn={true} />
      
      <h1 className="text-main-title-size font-semibold text-primary-600 text-center my-3 px-5 w-full text-center text-ellipsis break-words">
        {"Course - " + props.course?.courseName || props.error || "Lesson Page"}
      </h1>

      {/* add buttons edit course and delete course */}
      <div className="flex flex-row gap-4 tablet:justify-end justify-between gap-4 px-6 w-full mx-auto max-w-6xl">
        <Link href={`/course/${props.course?.id}/edit`} className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-md mobile:w-fit">Edit Course</Link>
        <Link href={`/course/${props.course?.id}/delete`} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md mobile:w-fit">Delete Course</Link>
      </div>

      {/* if props.error, have a button go back to page "/" */}
      {props.error !== null ?
        <DisplayErrorCard error={props.error} />
      :
      <div className="flex flex-col tablet:flex-row flex-wrap mobile:flex-nowrap justify-between gap-8 px-6 w-full mx-auto max-w-6xl mb-8">

        {/* if props.course, show a layered list of the units and lessons */}
        <AsideCourseMenu courseId={props.courseId} course={props.course} selectedLesson={props.selectedLesson.id} />

        {/* a section that shows the content of the lesson */}
        <section className="flex flex-col gap-4 px-4 py-3 rounded-md border-primary-500 w-full border-2">
          <h2 className="text-secondary-title-size font-semibold text-primary-600">
            {props.selectedLesson?.lessonName || "Lesson Name"}
          </h2>

          {/* show buttons edit and delete lesson wrap it with div */}
          <div className="flex gap-3">
            <button
              className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-md mobile:w-fit"> 
              <Link href={`/course/${props.courseId}/lesson/${props.selectedLesson.id}/edit`}>
                Edit lesson
              </Link>
            </button>
            <button
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md mobile:w-fit"> 
              <Link href={`/course/${props.courseId}/lesson/${props.selectedLesson.id}/delete`}>
                Delete lesson
              </Link>
            </button>
          </div>

          {/* show completion status */}
          <p className="">
            <span className="text-large-content-size">Completion status: </span> 
            <span className="text-secondary-500 normal-content-size">
              {props.selectedLesson?.completionStatus || "Not prepped"}
            </span>
          </p>
          {/* show the unit and lesson number */}
          <p className="">
            <span className="text-large-content-size">Lesson number: </span>
            <span className="normal-content-size">
              {props.selectedLesson?.lessonNumber || "NA"}
            </span>
          </p>
          <p className="">
            <span className="text-large-content-size">Unit number: </span>
            <span className="normal-content-size">
              {/* find the unit number from the courses object, search for the unit within the course that has the same unitId as id */}
              {props.course.units?.filter((unit, i) => unit.id === props.selectedLesson?.unitId)[0]?.unitNumber || "NA"}
            </span>
          </p>
          {/* show expected outcomes, this is stored in a text and is to show in creen with new lines and taps */}
          <div>
            <h3 className="text-large-content-size font-semibold">
              Expected outcomes
            </h3>
            {/* show expected outcomes saved in db as a wysiwyg html tags */}
            {props.selectedLesson?.expectedOutcomes && (
              <div className="lesson-list-wrapper" dangerouslySetInnerHTML={{__html: props.selectedLesson?.expectedOutcomes}}></div>
            ) || "No expected outcomes to show"}
          </div>

        {/* show the assessment of the lesson, stored the same way and displayed on page the same way as the expected outcomes */}
          <div className="">
            <h3 className="text-large-content-size font-semibold">
              Assessment
            </h3>
            {props.selectedLesson?.assessment && (
            <div className="lesson-list-wrapper" dangerouslySetInnerHTML={{__html: props.selectedLesson?.assessment}}></div>
            ) || "No assessments to show"}
          </div>

          {/* make the files section, for uploading and downloading files, this feature will be added later */}
          {/* make a button to direct to add new note page */}
          <button
            className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-md mobile:w-fit"> 
            <Link href={`/course/${props.courseId}/lesson/${props.selectedLesson.id}/new-file`}>
              Upload a file
            </Link>
          </button>

          {/* display a list of files, add replace and delete buttons */}
          <div>
            <h3 className="text-large-content-size font-semibold">
              Recorded Files
            </h3>
            <ul className="pl-4 flex flex-col gap-2 laptop:w-8/12 w-full">
              {props.files.map((file, i) => (
                <FileListElement 
                  key={i}
                  fileUrl={`/course/${props.courseId}/file/${file.id}`} 
                  fileName={
                    file.fileDisplayName.length > 28 ?
                    file.fileDisplayName.slice(0, 28) + "..." :
                    file.fileDisplayName
                  } 
                />
              ))}
            </ul>
          </div>

          {/* make a button to direct to add new note page */}
          <button
            className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-md mobile:w-fit"> 
            <Link href={`/course/${props.courseId}/lesson/${props.selectedLesson.id}/new-note`} >
              Add a note
            </Link>
          </button>

          {/* have a list of notes, display the titles, and the edit/delete buttons */}
          <div>
            <h3 className="text-large-content-size font-semibold">
              Saved Notes
            </h3>

            <ul className="pl-4 flex flex-col gap-2 laptop:w-8/12 w-full">
              {props.notes.map((note, i) => (
                <NoteListElement 
                  key={i}
                  noteUrl={`/course/${props.courseId}/note/${note.id}`} 
                  noteName={
                    note.title.length > 28 ? 
                    note.title.slice(0, 28) + "..." : 
                    note.title
                  } 
                />
              ))}
            </ul>
          </div>
        </section>
      </div>
      }
    </main>
  );
}
