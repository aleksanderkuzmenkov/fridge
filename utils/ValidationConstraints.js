import { validate } from 'validate.js';

export const validateString = (id, value) => {
    const constraints = {
        presence: {
            allowEmpty: false,
            message: "is required"
        },
        format: {
            pattern: ".+",
            flags: "i",
            message: "Value can't be blank."
        }
    };

    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return {
        isValid: !validationResult,
        errorMessage: validationResult ? validationResult[id][0] : ""
    };
}

export const validateEmail = (id, value) => {
    const constraints = {
        presence: {
            allowEmpty: false,
            message: "is required"
        },
        email: {
            message: "is not valid"
        }
    };

    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return {
        isValid: !validationResult,
        errorMessage: validationResult ? validationResult[id][0] : ""
    };
}

export const validatePassword = (id, value) => {
    const constraints = {
        presence: {
            allowEmpty: false,
            message: "is required"
        },
        length: {
            minimum: 6,
            message: "must be at least 6 characters"
        }
    };

    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return {
        isValid: !validationResult,
        errorMessage: validationResult ? validationResult[id][0] : ""
    };
}