import { ValidTypes } from "../../shared/types";
import Value from "../Functional/Value";

class TypeString {
    public static checkRequirements(value: string): boolean {
        return true;
    }

    public static convertFrom(value: string): string {
        return value;
    }

    public static convertFromOtherType<G extends ValidTypes>(value: G): string {
        const stringValue = value.toString();
        return stringValue;
    }

    public static compareLess(a: Value, b: Value): boolean {
        return a.value < b.value;
    }
    public static compareEqual(a: Value, b: Value): boolean {
        return a.value === b.value;
    }
    public static compareBigger(a: Value, b: Value): boolean {
        return a.value > b.value;
    }
}

export default TypeString;

