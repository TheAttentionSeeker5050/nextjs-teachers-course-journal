import React from 'react';
import Link from 'next/link';

const FileListElement = (props) => {
    return (
        <li className="text-normal-content-size my-2">
            <span className="mr-8 hover:text-primary-300 text-primary-500">
                <Link href={`${props.fileUrl}`}>
                    {props.fileName}
                </Link>
            </span>
            <button className="bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded-md mx-2">
                <Link href={`${props.fileUrl}/edit`}>
                    Replace
                </Link>
            </button>
            <button className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded-md">
                <Link href={`${props.fileUrl}/delete`}>
                    Delete
                </Link>
            </button>
        </li>
    );
}

export default FileListElement;