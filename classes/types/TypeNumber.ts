import { ValidTypes } from "../../shared/types";
import Value from "../Functional/Value";

class TypeNumber {
    public static checkRequirements(value: string): boolean {
        return /^-?\d*(\.\d+)?$/.test(value);
    }

    public static convertFrom(value: string): Number {
        if (TypeNumber.checkRequirements(value)) return parseFloat(value);
        else
            throw new Error(
                `Значание ${value} невозможно привести к типу Number`
            );
    }

    public static convertFromOtherType<G extends ValidTypes>(value: G): Number {
        const stringValue = value.toString();
        return TypeNumber.convertFrom(stringValue);
    }

    public static compareLess(a: Value, b: Value): boolean {
        const numberA = TypeNumber.convertFromOtherType(a.value);
        const numberB = TypeNumber.convertFromOtherType(b.value);
        return numberA < numberB;
    }
    public static compareEqual(a: Value, b: Value): boolean {
        const numberA = TypeNumber.convertFromOtherType(a.value);
        const numberB = TypeNumber.convertFromOtherType(b.value);
        return numberA === numberB;
    }
    public static compareBigger(a: Value, b: Value): boolean {
        const numberA = TypeNumber.convertFromOtherType(a.value);
        const numberB = TypeNumber.convertFromOtherType(b.value);
        return numberA > numberB;
    }
}

export default TypeNumber;

