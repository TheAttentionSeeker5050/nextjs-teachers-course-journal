// import the tinyMCE editor libs
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const CustomEditor = ({
    apiKey,
    fieldName,
}) => {
    // the tinyMCE editor reference hook
    const editorRef = useRef(null);
    
    return (
        <Editor
            name={fieldName}
            apiKey={apiKey}
            onInit={(evt, editor) => editorRef.current = editor}
            init={{
            height: 500,
            menubar: false,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            max_height: 300,
        }}
    />
    )
}

export default CustomEditor;
