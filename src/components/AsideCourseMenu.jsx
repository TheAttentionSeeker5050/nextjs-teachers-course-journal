import React from 'react';
import Link from 'next/link';

const AsideCourseMenu = (props) => {
    // props:
    // courseId - number
    // units - array
    // selectedUnit - string - unitNumber
    // selectedLesson - string - lessonNumber
    // key - string
    console.log(props.selectedLesson);
    return (
        
        <aside className="flex flex-col gap-3 px-4 py-3 rounded-md border-primary-500 border-2 tablet:max-w-72">
            <h2 className="text-secondary-title-size font-semibold text-primary-600">
                Units and Lessons
            </h2>
            {props.course?.units.map((unit, i) => (
                <div key={props.key} className="flex flex-col gap-3">
                    <h3 className={`text-tertiary-title-size font-semibold text-ellipsis break-words ${unit.unitNumber === props.selectedUnit ? "text-primary-600 hover:text-primary-300" : "text-slate-600 hover:text-slate-300"}`}>
                        <Link href={`/course/${props.courseId}/unit/${unit.unitNumber}`}>
                            Unit {unit.unitNumber} - {unit.unitName}
                        </Link>
                    </h3>
                    <div className="flex flex-col gap-3">
                    {unit.lessons.map((lesson, j) => (
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
            ))}
            {/* a div for displaying the add new unit button */}
            <button className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-md  my-4">
                <Link href={`/course/${props.courseId}/unit/new`}>
                Add a new unit
                </Link>
            </button>
        </aside>

    )
    // return (
    //     <div key={props.key} className="flex flex-col gap-3">
    //         <h3 className={`text-tertiary-title-size font-semibold text-ellipsis break-words ${props.unit.unitNumber === props.selectedUnit ? "text-primary-600 hover:text-primary-300" : "text-slate-600 hover:text-slate-300"}`}>
    //         <Link href={`/course/${props.courseId}/unit/${props.unit.unitNumber}`}>
    //             Unit {props.unit.unitNumber} - {props.unit.unitName}
    //         </Link>
    //         </h3>
    //         <div className="flex flex-col gap-3">
    //         {props.unit.lessons.map((lesson, j) => (
    //             <div key={j} className="flex flex-col gap-3">
    //             <h4 className={`normal-content-size font-semibold   text-ellipsis break-words ${lesson.lessonNumber === props.selectedLesson ? "text-primary-500 hover:text-primary-300" : "text-slate-800 hover:text-slate-500"}`}>
    //                 <Link href={`/course/${props.courseId}/lesson/${lesson.lessonNumber}`}>
    //                     Lesson {lesson.lessonNumber} - {lesson.lessonName}
    //                 </Link>
    //             </h4>
    //             </div>
    //         ))}
    //         </div>
            
    //     </div>
    // );
}

export default AsideCourseMenu;