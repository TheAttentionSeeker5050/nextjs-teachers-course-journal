import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// import components
import Navbar from '@/components/Navbar';
import Link from 'next/link';


export default function Unauthorized() {


    return (
      <main
        className={`${inter.className} flex flex-col items-center min-h-screen gap-5 px-3`}
      >
        <Navbar isLoggedIn={false} />

        <h1 className="text-main-title-size font-semibold text-primary-600 text-center my-3">
          User is not authorized 
        </h1>

        <p className="text-tertiary-title-size">
          Please 
          <Link href="/login" className='hover:text-primary-500 text-primary-700'> login </Link>
           to access this page
        </p>
  
        
      </main>
    );
  }
  