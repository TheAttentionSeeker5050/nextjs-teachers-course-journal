export async function getServerSideProps(context) {

    // get courseId, lessonId, and fileId from the context
    const { courseId, lessonId } = context.query;

    return {
        props: {
            foo: 'bar',
            courseId,
            lessonId
        }
    }
}

export default function UploadNewFileAttachment(props) {
    return (
        <>
            <h1>Upload New File Page</h1>
            <p>Foo: {props.foo}</p>
            <p>Course ID: {props.courseId}</p>
            <p>Lesson ID: {props.lessonId}</p>
        </>
    )
}

