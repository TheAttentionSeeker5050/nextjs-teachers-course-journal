// login function to parse a user for auth
export async function login(email, password) {
    try {
        // Make a request to backend API endpoint for user authentication
        const response = await fetch('/api/live/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Parse the response JSON
        const data = await response.json();

        // Check if login was successful
        if (response.ok) {
            return { success: true, data };
        } else {
            // If login failed, return an error message
            return { success: false, message: data.error || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'An error occurred during login' };
    }
}



