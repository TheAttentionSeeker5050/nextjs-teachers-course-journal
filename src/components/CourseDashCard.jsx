import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CourseOptionsMenu from './CourseOptionsMenu';

const CourseDashCard = ({ course, imageUrl }) => {
  return (
    <div className="relative mx-auto flex flex-col justify-start gap-2 " 
    key={course.id}>
      <CourseOptionsMenu courseId={course.id} />
      <Link href={`/course/${course.id}`} key={course.id} className='h-full'>
        <div className='flex flex-col justify-between h-full gap-3'> 
          <Image
            src={imageUrl}
            alt={course.courseName + " Thumbnail"}
            width={200}
            height={200}
            className="mx-auto w-fit h-fit object-cover rounded-lg flex-grow shadow-md shadow-slate-500"
          />
          {/* if the course name is longer than 30 characters, we will show the first 30 characters and add "..." */}
          <p className="text-large-content-size text-secondary-500 text-center">
            {course.courseName.length > 25 ? course.courseName.substring(0, 25) + "..." : course.courseName}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CourseDashCard;