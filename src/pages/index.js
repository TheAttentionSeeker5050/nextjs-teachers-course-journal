import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import prisma from "@/data/prisma";
import { createUser, getUserById } from "@/data/dbTransactions/user.dbTransaction";

// here we will also get cookies
export const getServerSideProps = async (context) => {

  // get the user by id
  const user = await getUserById(1);

  // transform the dates into a string, instead of this we should format the date, more on this later
  user.dateCreated = user.dateCreated.toString();
  user.dateUpdated = user.dateUpdated.toString();

  // // get the cookies foo=bar, just for testing at this moment
  // const cookies = context.req.headers.cookie;
  // const bar = cookies.split("foo=")[1]?.split(";")[0];
  
  return { props: { user } }
}

export default function Home(props) {


  return (
    <main
      className={`${inter.className}`}
    >
      <h1 className="">
        Title
      </h1>

      <div className="flex flex-col">
        
        {/* display the user email, first name, last name, organization and title */}
        <p className="text-lg">
          {props.user.email}
        </p>
        <p className="text-lg">
          {props.user.firstName}
        </p>
        <p className="text-lg">
          {props.user.lastName}
        </p>
        <p className="text-lg">
          {props.user.organization}
        </p>
        <p className="text-lg">
          {props.user.title}
        </p>
        
      </div>
    </main>
  );
}
