import { useState } from 'react';
import Link from 'next/link';
import { useEffect } from 'react';

const CourseOptionsMenu = ({ courseId, triggerCourseDropdown, setTriggerCourseDropdown }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = async () => {
        await setTriggerCourseDropdown(!triggerCourseDropdown);
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsOpen(false);
    }, [triggerCourseDropdown]);

    return (
        <div className="relative">
            <button onClick={toggleDropdown} className="absolute top-4 right-3 z-10 p-1 rounded-lg bg-white shadow-md focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 18a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 6a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute top-10 right-3 mt-2 w-46 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <Link href={`/course/${courseId}/edit/`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Edit Course
                    </Link>
                    <Link href={`/course/${courseId}/delete/`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Delete Course
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CourseOptionsMenu;

