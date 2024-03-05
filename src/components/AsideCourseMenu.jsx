import React from 'react';
import Link from 'next/link';
import { useEffect } from 'react';

// fontawesome downloads
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const AsideCourseMenu = (props) => {
    // props:
    // courseId - number
    // units - array
    // selectedUnit - string - unitNumber
    // selectedLesson - string - lessonNumber
    // key - string

    // have a state variable called isMenuExpanded
    // when the user taps on mobile, the menu will expand
    const [isMenuExpanded, setIsMenuExpanded] = React.useState(false);

    // use useEffect to collapse when the user is on mobile
    // this allows that it is checking if they must show the collapsible menu or not even if there 
    // is a resize event without the user refreshing the page
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuExpanded(true);
            } else {
                setIsMenuExpanded(false);
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // use useEffect to show and hide the menu items when changing the isMenuExpanded state
    useEffect(() => {
        if (isMenuExpanded) {
            document.getElementById('aside-menu-items').classList.remove('hidden');
        } else {
            document.getElementById('aside-menu-items').classList.add('hidden');
        }
    }, [isMenuExpanded]);
    

    return (
        
        <aside className="flex flex-col gap-3 px-4 py-3 rounded-md border-primary-500 border-2 tablet:max-w-72">
            <div className="flex flex-row justify-between items-center gap-3 text-primary-600 "  onClick={() => setIsMenuExpanded(!isMenuExpanded)}>
                <h2 className="text-secondary-title-size font-semibold ">
                    Units and Lessons
                </h2>
                {/* this will hide on screens bigger than tablet mode */}
                {isMenuExpanded ?
                    <FontAwesomeIcon icon={faChevronUp} size='lg' className='tablet:hidden'/>
                :
                    <FontAwesomeIcon icon={faChevronDown} size='lg' className='tablet:hidden'/>
                }
            </div>
            {/* when clicking one of the menu options, it will automatically collapse the menu */}
            <div className="tablet:flex flex-col gap-3 px-4 py-3 tablet:max-w-72 hidden" id='aside-menu-items'>
                {props.course?.units.sort((a, b) => a.unitNumber - b.unitNumber).map((unit, i) => (
                    <div key={i} className="flex flex-col gap-3">
                        <h3 className={`text-tertiary-title-size font-semibold text-ellipsis break-words`} >
                            <Link href={`/course/${props.courseId}/unit/${unit.unitNumber}`} onClick={() => setIsMenuExpanded(false)} className={`${unit.unitNumber === props.selectedUnit ? "text-primary-600 hover:text-primary-300" : "text-slate-600 hover:text-slate-300"}`}>
                                Unit {unit.unitNumber} - {unit.unitName}
                            </Link>
                        </h3>
                        <div className="flex flex-col gap-3">
                        {unit.lessons.sort((a, b) => a.lessonNumber - b.lessonNumber).map((lesson, j) => (
                            <div key={j} className="flex flex-col gap-3">
                                <h4 className={`normal-content-size font-semibold   text-ellipsis break-words`} >
                                    <Link href={`/course/${props.courseId}/lesson/${lesson.lessonNumber}`} onClick={() => setIsMenuExpanded(false)} className={`${lesson.lessonNumber === props.selectedLesson ? "text-primary-600 hover:text-primary-300" : "text-slate-600 hover:text-slate-300"}`}>
                                        Lesson {lesson.lessonNumber} - {lesson.lessonName}
                                    </Link>
                                </h4>
                            </div>
                        ))}
                        </div>
                        
                    </div>
                ))}
            </div>
            {/* a div for displaying the add new unit button */}
            <button className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-md  my-4">
                <Link href={`/course/${props.courseId}/unit/new`}>
                Add a new unit
                </Link>
            </button>
        </aside>

    )
}

export default AsideCourseMenu;