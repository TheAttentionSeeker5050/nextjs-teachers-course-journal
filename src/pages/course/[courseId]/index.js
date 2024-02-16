import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// import { getCoursesByUserId } from "@/data/dbTransactions/course.dbTransaction";
import { getCourseById,getCourseByIdWithChildrenById } from "@/data/dbTransactions/course.dbTransaction";


// import component CourseDashCard and Navbar
// import CourseDashCard from '@/components/CourseDashCard';
import Navbar from '@/components/Navbar';

// here we will also get cookies
export const getServerSideProps = async (context) => {

  // the the x-user-payload from the headers
  const userPayloadStr = context.req.headers['x-user-payload'];
  
  if (!userPayloadStr) {
    console.log("no user payload");
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
  // console.log("courseId", courseId);
  // console.log("user", user);

  try {

    // get the user usign db transaction
    // let courseFromDb = await getCourseById(parseInt(courseId));
    let courseFromDb = await getCourseByIdWithChildrenById(parseInt(courseId));
    
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
    let { unit, lesson } = await context.query;
    // query is: /course/[courseId]?unit=1&lesson=1
    
    if (!unit || !parseInt(unit) || parseInt(unit) < 1) {
      unit = "1";
    }
    if (!lesson || !parseInt(lesson) || parseInt(lesson) < 1) {
      lesson = "1";
    }

    // if unitNumber and lessonNumber are not defined, default to first lesson of first unit
    // use filter to get the selected lesson
    const selectedUnit = courseFromDb.units?.filter((u, i) => u.unitNumber === parseInt(unit))[0]
    // console.log("selectedUnit", selectedUnit);
    if (!selectedUnit) {
      return {
        props: {
          course: null,
          error: "Unit or lesson not found",
          selectedLesson: null
        }
      }
    }
    const selectedLesson = selectedUnit.lessons?.filter((l, i) => l.lessonNumber === parseInt(lesson))[0] || selectedUnit.lessons[0] || null;

    if (!selectedLesson) {
      return {
        props: {
          course: null,
          error: "Lesson not found",
          selectedLesson: null
        }
      }
    }

    return { 
      props: {
        course: courseFromDb,
        error: null,
        selectedLesson: selectedLesson
      } 
    }
    
  } catch (error) {
    return {
      props: {
        course: null,
        error: error.message,
        selectedLesson: null

      }
    }
  }
}

export default function SingleCourse(
    props
) {

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
        {"Course - " + props.course?.courseName || props.error || "Course Page"}
      </h1>

      {/* if props.error, have a button go back to page "/" */}
      {props.error !== null ?
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="bg-primary-600 text-white px-3 mx-auto py-2 rounded-md"
        >
          Go back to Home
        </button>
      :
      <div className="flex flex-col mobile:flex-row flex-wrap mobile:flex-nowrap justify-between gap-8 px-6 w-full mx-auto max-w-6xl">

        {/* if props.course, show a layered list of the units and lessons */}
        <aside className="flex flex-col gap-3 px-4 py-3 rounded-md border-primary-500 border-2 max-w-72 mx-auto">
          {props.course?.units.map((unit, i) => (
            <div key={i} className="flex flex-col gap-3">
              <h2 className="text-secondary-title-size font-semibold text-primary-600 hover:text-primary-300 text-ellipsis break-words">
                <Link href={`/course/1?unit=${unit.unitNumber}`}>
                  Unit {unit.unitNumber} - {unit.unitName}
                </Link>
              </h2>
              <div className="flex flex-col gap-3">
                {unit.lessons.map((lesson, j) => (
                  <div key={j} className="flex flex-col gap-3">
                    <h3 className="text-sub-title-size font-semibold text-slate-800 hover:text-slate-500 text-ellipsis break-words">
                      <Link href={`#`}>
                        Lesson {lesson.lessonNumber} - {lesson.lessonName}
                      </Link>
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* a section that shows the content of the lesson */}
        <section className="flex flex-col gap-4 px-4 py-3 rounded-md border-primary-500 w-full  border-2">
          <h2 className="text-secondary-title-size font-semibold text-primary-600">
            {props.selectedLesson?.lessonName || "Lesson Name"}
          </h2>
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
            <ul className="list-disc list-inside pl-4">
              {props.selectedLesson?.epectedOutcomes?.split("\n").map((outcome, i) => (
                <li key={i} className="text-normal-content-size my-2">{outcome}</li>
                ))}
            </ul>
          </div>

        {/* show the assessment of the lesson, stored the same way and displayed on page the same way as the expected outcomes */}
          <div>
            <h3 className="text-large-content-size font-semibold">
              Assessment
            </h3>
            {props.selectedLesson?.assessment && (
            <ul className="list-disc list-inside pl-4">
              {props.selectedLesson?.assessment?.split("\n").map((assessment, i) => (
                <li key={i} className="text-normal-content-size my-2">{assessment}</li>
                ))}
            </ul>
            ) || "No assessments to show"}
          </div>
          {/* make the files section, for uploading and downloading files, this feature will be added later */}
          {/* make a button to direct to add new note page */}
          <button
            className="bg-primary-600 text-white px-4 py-2 rounded-md mobile:w-fit"> 
            <Link href={`#`}>
              Upload a file
            </Link>
          </button>

          {/* display a list of files, add replace and delete buttons */}
          <div>
            <h3 className="text-large-content-size font-semibold">
              Recorded Files
            </h3>
            <ul className="pl-4">
              <li className="text-normal-content-size my-2">
                <span className="mr-8 hover:text-primary-300 text-primary-500">
                  <Link href={`#`}>
                    File-name-1.docx
                  </Link>
                </span>
                <button className="bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded-md mx-2">Replace</button>
                <button className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded-md">Delete</button>
              </li>
            </ul>
          </div>
          {/* make a button to direct to add new note page */}
          <button
            className="bg-primary-600 text-white px-4 py-2 rounded-md mobile:w-fit"> 
            <Link href={`#`}>
              Add a note
            </Link>
          </button>

          {/* have a list of notes, display the titles, and the edit/delete buttons */}
          <div>
            <h3 className="text-large-content-size font-semibold">
              Saved Notes
            </h3>

            <ul className="pl-4">
              <li className="text-normal-content-size my-2">
                <span className="mr-8 hover:text-primary-300 text-primary-500 break-words">
                  <Link href={`#`}>
                    Note name 1

                  </Link>
                </span>
                <button className="bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded-md mx-2">Edit</button>
                <button className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded-md">Delete</button>
              </li>
            </ul>
          </div>
        </section>

      </div>
      }
    </main>
  );
}
