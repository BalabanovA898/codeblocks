import { ValidTypes } from "../../shared/types";
import Value from "../Functional/Value";

class TypeBool {
    public static checkRequirements(value: string): boolean {
        return true;
    }

    public static convertFrom(value: string): boolean {
        return value !== "" && value !== "0";
    }

    public static convertFromOtherType<G extends ValidTypes>(
        value: G
    ): boolean {
        const stringValue = value.toString();
        return TypeBool.convertFrom(stringValue);
    }

    public static compareLess(a: Value, b: Value): boolean {
        const numberA = TypeBool.convertFromOtherType(a.value);
        const numberB = TypeBool.convertFromOtherType(b.value);
        return numberA < numberB;
    }

    public static compareEqual(a: Value, b: Value): boolean {
        const numberA = TypeBool.convertFromOtherType(a.value);
        const numberB = TypeBool.convertFromOtherType(b.value);
        return numberA === numberB;
    }

    public static compareBigger(a: Value, b: Value): boolean {
        const numberA = TypeBool.convertFromOtherType(a.value);
        const numberB = TypeBool.convertFromOtherType(b.value);
        return numberA > numberB;
    }
}

export default TypeBool;

