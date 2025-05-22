import { Class, InterpreterTypes, ValidTypes } from "../../shared/types";

interface Value {
    type: Class<InterpreterTypes>;
    value: ValidTypes;
}

class Value implements Value {
    type: Class<InterpreterTypes>;
    value: ValidTypes;

    constructor(type: Class<InterpreterTypes>, value: ValidTypes) {
        this.type = type;
        this.value = value;
    }
}

export default Value;

