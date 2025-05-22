import { ValidTypes } from "../../shared/types";
import Value from "../Functional/Value";

class TypeVoid {
    public checkRequirements(value: string): boolean {
        return true;
    }

    public convertFrom(value: string): boolean {
        throw new Error("Тип void не может быть преобразован из другого типа.");
    }

    public convertFromOtherType<G extends ValidTypes>(value: G): boolean {
        throw new Error("Тип void не может быть преобразован из другого типа.");
    }

    public compareLess(a: Value, b: Value): boolean {
        throw new Error("Тип void не может быть сравним с другими типами.");
    }

    public compareEqual(a: Value, b: Value): boolean {
        throw new Error("Тип void не может быть сравним с другими типами.");
    }

    public compareBigger(a: Value, b: Value): boolean {
        throw new Error("Тип void не может быть сравним с другими типами.");
    }
}

export default TypeVoid;

