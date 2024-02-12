

// create a component navbar with login, logout and signup
import React from 'react';
import Link from 'next/link';

const Navbar = ({ isLoggedIn }) => {
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/live/logout', {
                method: 'POST',
            });
            if (response.ok) {
                // Redirect to the login page 
                window.location.href = '/login';
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="navbar flex flex-row gap-4 justify-center text-tertiary-title-size bg-primary-600 w-screen py-4 text-white">

            <Link href="/" className='hover:text-slate-300'>Home</Link>

            {isLoggedIn ?
                // <Link href="/logout" className='hover:text-slate-300'>Logout</Link>
                <button onClick={handleLogout} className='hover:text-slate-300'>Logout</button>
                :
                <>
                    <Link href="/login" className='hover:text-slate-300'>Login</Link>
                    <Link href="/signup" className='hover:text-slate-300'>Sign Up</Link>
                </>
            }

        </nav>
    );
}

export default Navbar;