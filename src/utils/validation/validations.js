import { z } from 'zod';

// Email Validation with Zod
// Define a Zod schema for email
const emailSchema = z.string().email();

// Email Validation using Zod
export function isValidEmailZod(email) {
    try {
        // Parse and validate the email using the Zod schema
        emailSchema.parse(email);
        // If parsing is successful, the email is valid
        return { isValid: true, error: null };
    } catch (error) {
        // If parsing fails, the email is invalid, and an error message is provided
        return { isValid: false, error: 'Invalid email format' };
    }
}

// Password Validation with Zod
// Define a Zod schema for password
const passwordSchema = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character',
    });

// Password Validation using Zod
export function isValidPasswordZod(password) {
    try {
        // Parse and validate the password using the Zod schema
        passwordSchema.parse(password);
        // If parsing is successful, the password is valid
        return { isValid: true, error: null };
    } catch (error) {
        // If parsing fails, the password is invalid, and the first error message is provided
        return { isValid: false, error: error.errors[0] };
    }
}

// Sanitized String Input with Zod
// Define a Zod schema for a sanitized string input
const sanitizedStringSchema = z.string().regex(/^[a-zA-Z0-9]*$/, { message: 'Input must contain only alphanumeric characters', });

// Sanitized String Input Validation using Zod
export function isSanitizedStringZod(input) {
    try {
        // Parse and validate the input using the Zod schema
        sanitizedStringSchema.parse(input);
        // If parsing is successful, the input is valid
        return { isValid: true, error: null };
    } catch (error) {
        // If parsing fails, the input is invalid, and the first error message is provided
        return { isValid: false, error: error.errors[0] };
    }
}

// Size of Characters with Zod
// Define a Zod schema for size of characters
const sizeSchema = z.string().min(5, { message: 'Input must be at least 5 characters long' }).max(10, { message: 'Input must be at most 10 characters long' });

// Size of Characters Validation using Zod
export function isValidSizeZod(input) {
    try {
        // Parse and validate the input using the Zod schema
        sizeSchema.parse(input);
        // If parsing is successful, the input is valid
        return { isValid: true, error: null };
    } catch (error) {
        // If parsing fails, the input is invalid, and the first error message is provided
        return { isValid: false, error: error.errors[0] };
    }
}

// Date Validation with Zod (YYYY-MM-DD format)
// Define a Zod schema for date validation (YYYY-MM-DD format)
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in the YYYY-MM-DD format', });

// Date Validation using Zod
export function isValidDateZod(date) {
    try {
        // Parse and validate the date using the Zod schema
        dateSchema.parse(date);
        // If parsing is successful, the date is valid
        return { isValid: true, error: null };
    } catch (error) {
        // If parsing fails, the date is invalid, and the first error message is provided
        return { isValid: false, error: error.errors[0] };
    }
}

// Matched Strings with Zod
// Define a Zod schema for matching strings
const matchingStringSchema = z.enum(["prepped", "done", "not prepped"]);

// Matching Strings Validation using Zod
export function isMatchingStringZod(input) {
    try {
        // Attempt to parse and validate the input using the Zod schema
        matchingStringSchema.parse(input);
        return { isValid: true, error: null };
    } catch (error) {
        return { isValid: false, error: error.errors[0] };
    }
}

// Not Undefines using Zod
// Define a Zod schema for a value that should not be undefined
const notUndefinedSchema = z.any().refine(data => data !== undefined, {
    message: 'Value cannot be undefined',
});

// Not Undefined Validation using Zod
export function isNotUndefinedZod(value) {
    try {
        // Validate the value using the Zod schema
        notUndefinedSchema.parse(value);
        return { isValid: true, error: null };
    } catch (error) {
        return { isValid: false, error: error.errors[0] };
    }
}

// Not Empty using Zod
// Define a Zod schema for a non-empty string
const notEmptyStringSchema = z.string().min(1, { message: 'Value cannot be empty' });

// Not Empty Validation using Zod
export function isNotEmptyZod(value) {
    try {
        // Validate the value using the Zod schema
        notEmptyStringSchema.parse(value);
        return { isValid: true, error: null };
    } catch (error) {
        return { isValid: false, error: error.errors[0] };
    }
}
