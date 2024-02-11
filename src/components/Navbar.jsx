

// create a component navbar with login, logout and register
import React from 'react';
import Link from 'next/link';

const Navbar = ({isLoggedIn}) => {
    return (
        <nav className="navbar flex flex-row gap-4 justify-center text-tertiary-title-size bg-primary-600 w-screen py-4 text-white">
            
            <Link href="/" className='hover:text-slate-300'>Home</Link>
            
            {isLoggedIn ? 
                <Link href="/logout" className='hover:text-slate-300'>Logout</Link>
            :
                <>
                    <Link href="/login" className='hover:text-slate-300'>Login</Link>
                    <Link href="/register" className='hover:text-slate-300'>Register</Link>
                </>
            }
            
        </nav>
    );
}

export default Navbar;