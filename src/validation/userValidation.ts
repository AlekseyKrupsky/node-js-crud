import { Errors } from "../enums/errors";

const isArrayOfStrings = (array: any) => {
    return array.every((elem: any) => (typeof elem === "string"));
};

export const validateUser = (user: any): void => {
    if (
        user.name !== undefined && typeof user.name === "string"
        && user.age !== undefined && typeof user.age === "number"
        && user.hobbies !== undefined && Array.isArray(user.hobbies)
        && isArrayOfStrings(user.hobbies)
    ) {
        return;
    }

    throw new Error(Errors.VALIDATION_FAILED);
};