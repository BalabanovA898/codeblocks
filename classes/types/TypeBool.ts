import { ValidTypes } from "../../shared/types";
import Value from "../Functional/Value";

class TypeBool {
    constructor() {}
    public checkRequirements(value: string): boolean {
        return true;
    }

    public convertFrom(value: string): number {
        if (value === "true") return 1;
        if (value === "false") return 0;
        return value !== "" && value !== "0" ? 1 : 0;
    }

    public convertFromOtherType<G extends ValidTypes>(value: G): number {
        const stringValue = value.toString();
        return this.convertFrom(stringValue);
    }

    public compareLess(a: Value, b: Value): boolean {
        const numberA = this.convertFromOtherType(a.value);
        const numberB = this.convertFromOtherType(b.value);
        return numberA < numberB;
    }

    public compareEqual(a: Value, b: Value): boolean {
        const numberA = this.convertFromOtherType(a.value);
        const numberB = this.convertFromOtherType(b.value);
        return numberA === numberB;
    }

    public compareBigger(a: Value, b: Value): boolean {
        const numberA = this.convertFromOtherType(a.value);
        const numberB = this.convertFromOtherType(b.value);
        return numberA > numberB;
    }
}

export default TypeBool;

