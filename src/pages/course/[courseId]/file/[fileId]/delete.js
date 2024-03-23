export async function getServerSideProps(context) {

    // get courseId, lessonId, and fileId from the context
    const { courseId, fileId } = context.query;

    return {
        props: {
            foo: 'bar',
            courseId,
            fileId
        }
    }
}

export default function DeleteFileAttachment(props) {
    return (
        <>
            <h1>Delete File Page</h1>
            <p>Foo: {props.foo}</p>
            <p>Course ID: {props.courseId}</p>
            <p>File ID: {props.fileId}</p>
        </>
    )
}

