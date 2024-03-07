import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// import components
import Navbar from '@/components/Navbar';
import Link from 'next/link';


export default function Custom500() {

    return (
      <main
        className={`${inter.className} flex flex-col items-baseline justify-center min-h-screen gap-5`}
      >
        {/* <Navbar isLoggedIn={false} /> */}

        <h1 className="text-main-title-size font-semibold text-primary-600 text-center my-3 px-5 w-full text-center text-ellipsis break-words">
          Something went wrong
        </h1>

        <p className="text-tertiary-title-size mx-auto">
            The server encountered an error
        </p>
        <p className="text-tertiary-title-size mx-auto">
          Please 
          <Link href="/" className='hover:text-primary-300 text-primary-500'> click here </Link>
           to go back to the main page
        </p>
  
        
      </main>
    );
  }
  