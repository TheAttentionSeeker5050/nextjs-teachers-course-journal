// components/EditCourse.js

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function EditCourse({ courseId, currentName }) {
    const [newName, setNewName] = useState(currentName);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/course/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ courseId, newCourseName: newName }),
            });
            if (response.ok) {
                router.reload(); // Refresh page after editing
            } else {
                console.error('Error editing course:', response.statusText);
            }
        } catch (error) {
            console.error('Error editing course:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
}
