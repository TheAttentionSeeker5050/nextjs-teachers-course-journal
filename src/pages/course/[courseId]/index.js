import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

// import { getCoursesByUserId } from "@/data/dbTransactions/course.dbTransaction";
import { getCourseById,getCourseByIdWithChildren } from "@/data/dbTransactions/course.dbTransaction";

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
    const selectedLesson = courseFromDb.units[0].lessons[0] || null;

    // serialize the lesson dates
    selectedLesson.dateCreated = selectedLesson.dateCreated?.toString() || null;
    selectedLesson.dateUpdated = selectedLesson.dateUpdated?.toString() || null;

    return { 
      props: {
        course: courseFromDb.id,
        error: null,
        selectedLesson: selectedLesson,
        courseId: courseId
      } 
    }
    
  } catch (error) {
    return {
      props: {
        course: null,
        error: error.message,
        selectedLesson: null,
        courseId: null

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
    router.push(`/course/${props.courseId}/lesson/${props.selectedLesson.id}`);
  } ,[]);
  
  return (<></>)
}
