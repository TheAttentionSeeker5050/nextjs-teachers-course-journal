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
  // const accessToken = cookies.split("accessToken=")[1]?.split(";")[0];
  // console.log('accessToken', accessToken);

  // // get the refresh token
  // const refreshToken = cookies.split("refreshToken=")[1]?.split(";")[0];
  // console.log('refreshToken', refreshToken);

  // // get user from req.user
  // const user2 = context.req.user;
  // console.log('user', context.req.headers['x-user-payload']);

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
