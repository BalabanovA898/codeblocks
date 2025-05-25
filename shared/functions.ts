import TypeBool from "../classes/types/TypeBool";
import TypeNumber from "../classes/types/TypeNumber";
import TypeString from "../classes/types/TypeString";
import TypeVoid from "../classes/types/TypeVoid";
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
            return TypeVoid;
    }
};
export function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

