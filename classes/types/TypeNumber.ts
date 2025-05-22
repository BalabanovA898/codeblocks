import { ValidTypes } from "../../shared/types";
import Value from "../Functional/Value";

class TypeNumber {
    constructor() {}
    public static checkRequirements(value: string): boolean {
        return /^-?\d*(\.\d+)?$/.test(value);
    }

    public convertFrom(value: string): Number {
        if (TypeNumber.checkRequirements(value)) return parseFloat(value);
        else
            throw new Error(
                `Значание ${value} невозможно привести к типу Number`
            );
    }

    public convertFromOtherType<G extends ValidTypes>(value: G): Number {
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

export default TypeNumber;

