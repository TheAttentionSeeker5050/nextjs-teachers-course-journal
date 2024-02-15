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

    return { 
      props: {
        course: courseFromDb,
        error: null
      } 
    }
    
  } catch (error) {
    return {
      props: {
        course: null,
        error: error.message
      }
    }
  }
}

export default function SingleCourse(
    props
) {

//   // for the moment we have a dummy image, which we get from the following url
//   const imageUrl = "/api/images?imageName=course-image.png"

  return (
    <main
      className={`${inter.className} flex flex-col items-baseline min-h-screen w-screen gap-5`}
    >
      {/* 
        because we would not be in this page otherwise, have the isLoggedIn 
        property set as true in this page, if no value is passed, it will default to undefined
        which will keep the login and register buttons as if it was set to false 
      */}
      <Navbar isLoggedIn={true} />
      
      <h1 className="text-main-title-size font-semibold text-primary-600 text-center my-3 px-5 w-full">
        {"Course - " + props.course?.courseName || props.error || "Course Page"}
      </h1>

      {/* if props.error, have a button go back to page "/" */}
      {props.error && (
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="bg-primary-600 text-white px-3 mx-auto py-2 rounded-md"
        >
          Go back to Home
        </button>
      )}


      <div className="flex flex-col mobile:flex-row flex-wrap mobile:flex-nowrap justify-between gap-8 px-6 w-full mx-auto max-w-6xl">

        {/* if props.course, show a layered list of the units and lessons */}
        <aside className="flex flex-col gap-3 px-4 py-3 rounded-md border-primary-500 border-2 max-w-72 mx-auto">
          {props.course?.units.map((unit, i) => (
            <div key={i} className="flex flex-col gap-3">
              <h2 className="text-secondary-title-size font-semibold text-primary-600 hover:text-primary-300">
                <Link href={`#`}>
                  Unit {unit.unitNumber} - {unit.unitName}
                </Link>
              </h2>
              <div className="flex flex-col gap-3">
                {unit.lessons.map((lesson, j) => (
                  <div key={j} className="flex flex-col gap-3">
                    <h3 className="text-sub-title-size font-semibold text-slate-800 hover:text-slate-500">
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
        <section className="flex flex-col gap-3 px-4 py-3 rounded-md border-primary-500 w-full  border-2">
          <h2 className="text-secondary-title-size font-semibold text-primary-600">
            Lesson name
          </h2>
          {/* show completion status */}
          <p className="text-label-size text-slate-800">
            Completion status: {" "}
            <span className="text-tertiary-700">
              {props.course?.isComplete ? "Complete" : "Incomplete"}
            </span>
          </p>
        </section>

      </div>

      
    </main>
  );
}
