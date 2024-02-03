import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });


export default function Unauthorized() {


    return (
      <main
        className={`${inter.className}`}
      >
        <h1 className="">
            Unauthorized
        </h1>

        <p>
        Please login to view this page
        </p>
  
        
      </main>
    );
  }
  