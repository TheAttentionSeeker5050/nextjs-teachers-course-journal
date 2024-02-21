import React from 'react';
import Link from 'next/link';

const DisplayErrorCard = (props) => {
    // props
    // error - string - the error message to display
    return (
        <div className='flex flex-col mx-auto gap-3'>
            <p className="text-xl text-center text-slate-700">
                {props.error}
            </p>

            <button
            onClick={() => {
                window.location.href = "/";
            }}
            className="bg-primary-600 text-white px-3 mx-auto py-2 rounded-md"
            >
                Go back to Home
            </button>
        </div>
    );
}

export default DisplayErrorCard;
