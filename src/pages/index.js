import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import prisma from "@/data/prisma";

export const getServerSideProps = async () => {
  // const feed = await prisma.post.findMany({
    
  // })
  // return { props: { feed } }
  return { props: {  } }
}

export default function Home(props) {

  // console.log(props.feed)

  return (
    <main
      className={`${inter.className}`}
    >
      <h1 className="">
        Title
      </h1>

      <div className="flex flex-col">
        {/* {props.feed.map((post) => (
          
          <div key={post.id} className="flex flex-col">
            <h2 className="text-2xl font-bold">
              {post.title}
            </h2>
            <p className="text-xl">
              {post.content}
            </p>
          </div>
        ))} */}
      </div>
    </main>
  );
}
