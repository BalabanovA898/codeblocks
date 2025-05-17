import { TYPES } from "../../shared/types";

interface Value {
    type: TYPES;
    value: string;
}

class Value implements Value {
    type: TYPES;
    value: string;

    constructor(type: TYPES, value: string) {
        this.type = type;
        this.value = value;
    }
}

export default Value;

