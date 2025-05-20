import TypeBool from "../classes/types/TypeBool";
import TypeNumber from "../classes/types/TypeNumber";
import TypeString from "../classes/types/TypeString";
import { Class, InterpreterTypes, ValidTypes } from "./types";

export const getTypeByString = (type: string): Class<InterpreterTypes> => {
    switch (type) {
        case "string":
            return TypeString;
        case "number":
            return TypeNumber;
        case "bool":
            return TypeBool;
        default:
            return TypeString;
    }
};

