import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { getCoursesByUserId } from "@/data/dbTransactions/course.dbTransaction";

// here we will also get cookies
export const getServerSideProps = async (context) => {

  // the the x-user-payload from the headers
  const userPayloadStr = context.req.headers['x-user-payload'];
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

  let courses = [];
  let error = null;

  // get the courses
  try {
    courses = await getCoursesByUserId(user.userId);
  } catch (error) {
    error = error;
  }

  // transform the dates into a string, instead of this we should format the date, more on this later
  user.dateCreated = user.dateCreated?.toString() || null;
  user.dateUpdated = user.dateUpdated?.toString() || null;

  courses.forEach((course) => {
    course.dateCreated = course.dateCreated?.toString() || null;
    course.dateUpdated = course.dateUpdated?.toString() || null;
  });
  
  return { props: {
    user,
    courses,
    error
   } }
}

export default function Home(props) {

  // for the moment we have a dummy image, which we get from the following url
  const imageUrl = "/api/images?imageName=course-image.png"
  return (
    <main
      className={`${inter.className}`}
    >
      <h1 className="">
        Courses Dashboard
      </h1>
      <h2 className=""> Faculty email: {props.user.email}</h2>

      {
        props.error 
        ? 
        <p className="text-lg text-red-500">{props.error}</p>
        :
        <div className="grid">
          {
            props.courses.map((course) => {
              return (
                <div key={course.id}>
                  <Image
                    src={imageUrl}
                    alt={course.courseName + " Thumbnail"}
                    width={200}
                    height={200}
                  />
                  <p className="text-lg">{course.courseName}</p>
                </div>
              )
            })
          }
        </div>
      }
    </main>
  );
}
