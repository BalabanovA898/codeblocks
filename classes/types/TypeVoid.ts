import { ValidTypes } from "../../shared/types";
import Value from "../Functional/Value";

class TypeVoid {
    public static checkRequirements(value: string): boolean {
        return true;
    }

    public static convertFrom(value: string): boolean {
        throw new Error("Тип void не может быть преобразован из другого типа.");
    }

    public static convertFromOtherType<G extends ValidTypes>(
        value: G
    ): boolean {
        throw new Error("Тип void не может быть преобразован из другого типа.");
    }

    public static compareLess(a: Value, b: Value): boolean {
        throw new Error("Тип void не может быть сравним с другими типами.");
    }

    public static compareEqual(a: Value, b: Value): boolean {
        throw new Error("Тип void не может быть сравним с другими типами.");
    }

    public static compareBigger(a: Value, b: Value): boolean {
        throw new Error("Тип void не может быть сравним с другими типами.");
    }
}

export default TypeVoid;

