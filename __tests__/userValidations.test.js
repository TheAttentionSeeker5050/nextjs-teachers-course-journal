// jest import 
import { describe, expect, test } from "@jest/globals";
import '@testing-library/jest-dom';

import {
    isValidEmail,
    isValidEmailZod,
    // isValidPassword,
    // isValidPasswordZod,
    // isSanitizedString,
    // isSanitizedStringZod,
    // isValidSize,
    // isValidSizeZod,
    // isValidDate,
    // isValidDateZod,
    // isMatchingString,
    // isMatchingStringZod,
    // isNotUndefined,
    // isNotEmpty,
    // isNotUndefinedZod,
    // isNotEmptyZod,
} from "@/utils/validation/validations";


describe("Validation Functions", () => {
    // Email Validation
    describe("isValidEmail", () => {
        it("should validate a valid email", () => {
            const validEmail = "test@example.com";
            expect(isValidEmail(validEmail)).toBe(true);
        });

        it("should invalidate an invalid email", () => {
            const invalidEmail = "invalid_email";
            expect(isValidEmail(invalidEmail)).toBe(false);
        });
    });

    // Email Validation with Zod
    describe("isValidEmailZod", () => {
        it("should validate a valid email using Zod", () => {
            const validEmail = "test@example.com";
            expect(isValidEmailZod(validEmail)).toEqual({ isValid: true, error: null });
        });

        it("should invalidate an invalid email using Zod", () => {
            const invalidEmail = "invalid_email";
            expect(isValidEmailZod(invalidEmail)).toEqual({ isValid: false, error: "Invalid email format" });
        });
    });

    // // Password Validation
    // describe("isValidPassword", () => {
    //     // Add test cases for isValidPassword
    // });

    // // Password Validation with Zod
    // describe("isValidPasswordZod", () => {
    //     // Add test cases for isValidPasswordZod
    // });

    // // Sanitized String Input
    // describe("isSanitizedString", () => {
    //     // Add test cases for isSanitizedString
    // });

    // // Sanitized String Input with Zod
    // describe("isSanitizedStringZod", () => {
    //     // Add test cases for isSanitizedStringZod
    // });

    // // Size of Characters
    // describe("isValidSize", () => {
    //     // Add test cases for isValidSize
    // });

    // // Size of Characters with Zod
    // describe("isValidSizeZod", () => {
    //     // Add test cases for isValidSizeZod
    // });

    // // Date Validation
    // describe("isValidDate", () => {
    //     // Add test cases for isValidDate
    // });

    // // Date Validation with Zod
    // describe("isValidDateZod", () => {
    //     // Add test cases for isValidDateZod
    // });

    // // Match Strings
    // describe("isMatchingString", () => {
    //     // Add test cases for isMatchingString
    // });

    // // Matched Strings with Zod
    // describe("isMatchingStringZod", () => {
    //     // Add test cases for isMatchingStringZod
    // });

    // // Not Undefined
    // describe("isNotUndefined", () => {
    //     // Add test cases for isNotUndefined
    // });

    // // Not Undefines using Zod
    // describe("isNotUndefinedZod", () => {
    //     // Add test cases for isNotUndefinedZod
    // });

    // // Not Empty
    // describe("isNotEmpty", () => {
    //     // Add test cases for isNotEmpty
    // });

    // // Not Empty using Zod
    // describe("isNotEmptyZod", () => {
    //     // Add test cases for isNotEmptyZod
    // });
});



