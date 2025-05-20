import { Class, InterpreterTypes } from "../../shared/types";

interface Value {
    type: Class<InterpreterTypes>;
    value: string;
}

class Value implements Value {
    type: Class<InterpreterTypes>;
    value: string;

    constructor(type: Class<InterpreterTypes>, value: string) {
        this.type = type;
        this.value = value;
    }
}

export default Value;

