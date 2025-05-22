import { ValidTypes } from "../../shared/types";
import Value from "../Functional/Value";

class TypeString {
    constructor() {}
    public checkRequirements(value: string): boolean {
        return true;
    }

    public convertFrom(value: string): string {
        return value;
    }

    public convertFromOtherType<G extends ValidTypes>(value: G): string {
        const stringValue = value.toString();
        return stringValue;
    }

    public compareLess(a: Value, b: Value): boolean {
        return (
            this.convertFromOtherType(a.value) <
            this.convertFromOtherType(b.value)
        );
    }
    public compareEqual(a: Value, b: Value): boolean {
        return (
            this.convertFromOtherType(a.value) ===
            this.convertFromOtherType(b.value)
        );
    }
    public compareBigger(a: Value, b: Value): boolean {
        return (
            this.convertFromOtherType(a.value) >
            this.convertFromOtherType(b.value)
        );
    }
}

export default TypeString;

