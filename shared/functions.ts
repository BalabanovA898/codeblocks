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

export const convertFrom = <T extends Class<InterpreterTypes>>(
    from: string,
    to: T
) => {
    if (new to() instanceof TypeNumber) return TypeNumber.convertFrom(from);
    if (new to() instanceof TypeString) return TypeString.convertFrom(from);
    if (new to() instanceof TypeBool) return TypeBool.convertFrom(from);
    if (new to() instanceof TypeVoid) return TypeVoid.convertFrom(from);
    throw new Error(`Ошибка при конвертации типов из ${from} в ${typeof to}`);
};

