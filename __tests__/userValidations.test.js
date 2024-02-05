// jest import 
import { describe, expect, test } from "@jest/globals";
import '@testing-library/jest-dom';

import {
    isValidEmailZod,
    isValidPasswordZod,
    isSanitizedStringZod,
    isValidSizeZod,
    isValidDateZod,
    isMatchingStringZod,
    isNotUndefinedZod,
    isNotEmptyZod,
} from "@/utils/validation/validations";

describe('Validation Functions', () => {
    // Email Validation
    test('isValidEmailZod should validate a correct email', () => {
        const validEmail = 'test@example.com';
        const result = isValidEmailZod(validEmail);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('isValidEmailZod should invalidate an incorrect email', () => {
        const invalidEmail = 'invalid-email';
        const result = isValidEmailZod(invalidEmail);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid email format');
    });

    // Password Validation
    test('isValidPasswordZod should validate a correct password', () => {
        const validPassword = 'StrongP@ssword1';
        const result = isValidPasswordZod(validPassword);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('isValidPasswordZod should invalidate a weak password', () => {
        const weakPassword = 'weakpassword';
        const result = isValidPasswordZod(weakPassword);
        expect(result.isValid).toBe(false);
        // Check if the error message includes the expected pattern
        expect(result.error.message).toMatch(/Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character/);
    });

    // isSanitizedStringZod Validation
    test('isSanitizedStringZod should validate a sanitized string input', () => {
        const sanitizedString = 'ValidSanitizedString123';
        const result = isSanitizedStringZod(sanitizedString);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('isSanitizedStringZod should invalidate a non-sanitized string input', () => {
        const nonSanitizedString = 'Invalid!@#$%^String';
        const result = isSanitizedStringZod(nonSanitizedString);
        expect(result.isValid).toBe(false);
        // Adjust the error message based on your validation logic
        expect(result.error.message).toContain('Input must contain only alphanumeric characters');
    });

    // isValidSizeZod Validation
    test('isValidSizeZod should validate input with correct size', () => {
        const validInput = 'ValidInput';
        const result = isValidSizeZod(validInput);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('isValidSizeZod should invalidate input with incorrect size', () => {
        const invalidInput = 'Invalid';
        const result = isValidSizeZod(invalidInput);
        expect(result.isValid).toBe(false);
        // Adjust the error message based on your validation logic
        expect(result.error.message).toMatch(/Input must be at least 5 characters long/);
    });

    // isValidDateZod Validation
    test('isValidDateZod should validate a correct date', () => {
        const validDate = '2022-02-05';
        const result = isValidDateZod(validDate);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('isValidDateZod should invalidate an incorrect date', () => {
        const invalidDate = '2022-02-32';
        const result = isValidDateZod(invalidDate);
        expect(result.isValid).toBe(false);
        // Adjust the error message based on your validation logic
        expect(result.error.message).toMatch(/Date must be in the YYYY-MM-DD format/);
    });

    // isMatchingStringZod Validation
    test('isMatchingStringZod should validate a matching string', () => {
        const matchingString = 'prepped';
        const result = isMatchingStringZod(matchingString);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('isMatchingStringZod should invalidate a non-matching string', () => {
        const nonMatchingString = 'invalid';
        const result = isMatchingStringZod(nonMatchingString);
        expect(result.isValid).toBe(false);
        // Adjust the error message based on your validation logic
        expect(result.error.message).toContain('Invalid enum value');
    });

    // isNotUndefinedZod Validation
    test('isNotUndefinedZod should validate a defined value', () => {
        const definedValue = 'defined';
        const result = isNotUndefinedZod(definedValue);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('isNotUndefinedZod should invalidate an undefined value', () => {
        const undefinedValue = undefined;
        const result = isNotUndefinedZod(undefinedValue);
        expect(result.isValid).toBe(false);
        // Adjust the error message based on your validation logic
        expect(result.error.message).toContain('Value cannot be undefined');
    });

    // isNotEmptyZod Validation
    test('isNotEmptyZod should validate a non-empty string', () => {
        const nonEmptyString = 'NonEmpty';
        const result = isNotEmptyZod(nonEmptyString);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe(null);
    });

    test('isNotEmptyZod should invalidate an empty string', () => {
        const emptyString = '';
        const result = isNotEmptyZod(emptyString);
        expect(result.isValid).toBe(false);
        // Adjust the error message based on your validation logic
        expect(result.error.message).toContain('Value cannot be empty');
    });
});



