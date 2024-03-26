import { useEffect } from 'react';
import prisma from '@/data/prisma';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';


export async function getServerSideProps(context) {
    // get courseId, lessonId, and fileId from the context
    const { courseId, fileId } = context.query;

    // get user payload from the headers
    const userPayloadStr = context.req.headers['x-user-payload'];
    //parse user payload
    const userPayload = JSON.parse(userPayloadStr);
    try {
        // search the file on db record
        const fileRecord = await prisma.fileUpload.findUnique({
            where: {
            id: parseInt(fileId),
            },
        });

        if (!fileRecord) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false
                }
            }
        }

        // if the user is not the owner of the course, redirect to 404
        if (fileRecord.userId !== userPayload.userId) {
            return {
                redirect: {
                    destination: '/unauthorized',
                    permanent: false
                }
            }
        }

        return {
            props: {
                foo: 'bar',
                courseId,
                fileId,
                fileName: fileRecord.fileDisplayName,
            }
        }
    } catch (error) {
        return {
            redirect: {
                destination: '/500',
                permanent: false
            }
        }
    }
    
}

export default function DeleteFileAttachment(props) {
    const { courseId, fileId, fileName } = props;
    const router = useRouter();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);  

    // function to handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // use fetch to send a DELETE request to the server
            const response = await fetch(`/api/course/${courseId}/file/${fileId}/delete`, {
                method: 'POST',
            });

            const jsonResponse = await response.json();

            // if the response is not ok, throw an error
            if (!response.ok) {
                throw new Error(jsonResponse.error);
            }

            setLoading(false);

            // if the response is ok, set the message
            setMessage(jsonResponse.message);

            // after 3 seconds, redirect to the course page
            setTimeout(() => {
                router.push(`/course/${courseId}`);
            }, 3*1000);

        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    }
    
    return (
        <> 
        {
            loading === true ? <div className='text-center'>Loading...</div>
            :
            <div className='p-4 flex flex-col gap-2 text-center'>
                
                <h1 className='text-main-title-size font-semibold text-primary-600 text-center my-3 px-5 w-full text-center text-ellipsis break-words mb-6'>
                    Are you sure you want to delete the file?
                </h1>
                { error ? 
                    <div className='text-red-500'>{error}</div> 
                : message ? 
                    <div className='text-green-500'>{message}</div> 
                : null }

                <p>File name: {props.fileName}</p>
                <form className="flex flex-row gap-4 mx-auto text-white" onSubmit={handleSubmit}>
                    <button type='submit' className='px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-md'>
                        Delete
                    </button>
        
                    <Link href={`/course/${courseId}`} className='px-4 py-2 bg-gray-500 hover:bg-gray-400 rounded-md'>
                        Cancel
                    </Link>
                </form>
            
            </div>
        }
        </>
      );
}

