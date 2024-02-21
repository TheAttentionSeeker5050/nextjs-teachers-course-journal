import React from 'react';
import Link from 'next/link';

const AsideCourseMenu = (props) => {
    // props:
    // courseId - number
    // units - array
    // selectedUnit - string - unitNumber
    // selectedLesson - string - lessonNumber
    // key - string
    return (
        <div key={props.key} className="flex flex-col gap-3">
            <h3 className={`text-tertiary-title-size font-semibold text-ellipsis break-words ${props.unit.unitNumber === props.selectedUnit ? "text-primary-600 hover:text-primary-300" : "text-slate-600 hover:text-slate-300"}`}>
            <Link href={`/course/${props.courseId}/unit/${props.unit.unitNumber}`}>
                Unit {props.unit.unitNumber} - {props.unit.unitName}
            </Link>
            </h3>
            <div className="flex flex-col gap-3">
            {props.unit.lessons.map((lesson, j) => (
                <div key={j} className="flex flex-col gap-3">
                <h4 className={`normal-content-size font-semibold   text-ellipsis break-words ${lesson.lessonNumber === props.selectedLesson ? "text-primary-500 hover:text-primary-300" : "text-slate-800 hover:text-slate-500"}`}>
                    <Link href={`/course/${props.courseId}/lesson/${lesson.lessonNumber}`}>
                        Lesson {lesson.lessonNumber} - {lesson.lessonName}
                    </Link>
                </h4>
                </div>
            ))}
            </div>
        </div>
    );
}

export default AsideCourseMenu;