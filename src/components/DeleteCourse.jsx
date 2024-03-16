// components/DeleteCourse.js

import { useRouter } from 'next/router';

export default function DeleteCourse({ courseId }) {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const response = await fetch('/api/course/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ courseId }),
            });
            if (response.ok) {
                router.reload(); // Refresh page after deletion
            } else {
                console.error('Error deleting course:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    return (
        <div>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}
