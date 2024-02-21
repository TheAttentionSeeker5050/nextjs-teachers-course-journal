import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// import { getCoursesByUserId } from "@/data/dbTransactions/course.dbTransaction";
import { getCourseById,getCourseByIdWithChildren } from "@/data/dbTransactions/course.dbTransaction";


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

    

    return { 
      props: {

      } 
    }
    
  } catch (error) {
    return {
      props: {
        
      }
    }
  }
}

export default function SingleCourse(
    props
) {
  // console.log("props", props.selectedLesson);
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
        {"Unit - " + props.course?.courseName || props.error || "Course Page"}
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
      <div className="flex flex-col tablet:flex-row flex-wrap mobile:flex-nowrap justify-between gap-8 px-6 w-full mx-auto max-w-6xl mb-8">

        {/* if props.course, show a layered list of the units and lessons */}
        <aside className="flex flex-col gap-3 px-4 py-3 rounded-md border-primary-500 border-2 tablet:max-w-72">
          <h2 className="text-secondary-title-size font-semibold text-primary-600">
            Units and Lessons
          </h2>
          {props.course?.units.map((unit, i) => (
            <div key={i} className="flex flex-col gap-3">
              <h3 className="text-tertiary-title-size font-semibold text-primary-600 hover:text-primary-300 text-ellipsis break-words">
                <Link href={`/course/${props.courseId}/unit/${unit.unitNumber}`}>
                  Unit {unit.unitNumber} - {unit.unitName}
                </Link>
              </h3>
              <div className="flex flex-col gap-3">
                {unit.lessons.map((lesson, j) => (
                  <div key={j} className="flex flex-col gap-3">
                    <h4 className="normal-content-size font-semibold text-slate-800 hover:text-slate-500 text-ellipsis break-words">
                      <Link href={`/course/${props.courseId}/lesson/${lesson.lessonNumber}`}>
                        Lesson {lesson.lessonNumber} - {lesson.lessonName}
                      </Link>
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* a section that shows the content of the lesson */}
        <section className="flex flex-col gap-4 px-4 py-3 rounded-md border-primary-500 w-full border-2">
          <h2 className="text-secondary-title-size font-semibold text-primary-600">
            {props.selectedLesson?.lessonName || "Unit Name"}
          </h2>

        {/* show buttons edit and delete lesson wrap it with div */}
          <div className="flex gap-3">
            <button
              className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-md mobile:w-fit"> 
              <Link href={`#`}>
              {/* <Link href={`/course/${props.courseId}/lesson/`}> */}
                Edit Unit
              </Link>
            </button>
            <button
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md mobile:w-fit"> 
              <Link href={`#`}>
                Delete Unit
              </Link>
            </button>
          </div>

        </section>
      </div>
      }
    </main>
  );
}
