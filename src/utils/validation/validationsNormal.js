
// Email Validation
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password Validation
export function isValidPassword(password) {
    // At least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// Sanitized String Input
export function isSanitizedString(input) {
    const sanitizedStringRegex = /^[a-zA-Z0-9]*$/;
    return sanitizedStringRegex.test(input);
}

// Size of Characters
export function isValidSize(input, minSize, maxSize) {
    return input.length >= minSize && input.length <= maxSize;
}

// Date Validation (YYYY-MM-DD format)
export function isValidDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
}

// Match Strings ("prepped", "done", "not prepped")
export function isMatchingString(input) {
    const allowedStrings = ["prepped", "done", "not prepped"];
    return allowedStrings.includes(input);
}

// Not Undefined
export function isNotUndefined(value) {
    return value !== undefined;
}

// Not Empty
export function isNotEmpty(value) {
    return value.trim() !== '';
}