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


export default function DownloadFile(props) {
    const { courseId, fileId, fileName } = props;
    const router = useRouter();
    const [downloaded, setDownloaded] = useState(false);
  
    useEffect(() => {
        if (downloaded) return;
        // after 3 seconds, redirect to the course page
        setTimeout(() => {
            router.push(`/api/course/${courseId}/file/${fileId}`);
        }, 3*1000);
        setDownloaded(true);
    });
  
    return (
      <div className='p-4 flex flex-col gap-8 text-center'>
        <h1 className='text-main-title-size font-semibold text-primary-600 text-center my-3 px-5 w-full text-center text-ellipsis break-words'>
            Downloading the file: {fileName}, please wait...
        </h1>
        <p>File name: {props.fileName}</p>
        <div className="flex flex-row gap-4 mx-auto text-white ">
            <Link href={`/api/course/${courseId}/file/${fileId}`} className='px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-md'>
                Download
            </Link>

            <Link href={`/course/${courseId}`} className='px-4 py-2 bg-gray-500 hover:bg-gray-400 rounded-md'>
                Back to course
            </Link>
        </div>
        
      </div>
    );
  }