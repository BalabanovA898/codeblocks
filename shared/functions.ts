import { TYPES } from "./types";

export const getTypeByString = (type: string): TYPES => {
    switch (type) {
        case "string":
            return TYPES.STRING;
        case "number":
            return TYPES.NUMBER;
        case "bool":
            return TYPES.BOOL;
        default:
            return TYPES.STRING;
    }
};

