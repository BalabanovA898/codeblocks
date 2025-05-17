import Value from "./Value";

interface LexicalEnvironment {
    values: Map<string, Value>;
    prev: LexicalEnvironment | null;
    getValue(name: string): Value | undefined;
    setValue(name: string, value: Value): void;
}

class LexicalEnvironment implements LexicalEnvironment {
    values: Map<string, Value>;
    prev: LexicalEnvironment | null;

    constructor(prev: LexicalEnvironment | null) {
        this.values = new Map<string, Value>();
        this.prev = prev;
    }

    getValue(name: string): Value | undefined {
        if (this.values.has(name)) return this.values.get(name);
        else if (this.prev !== null) return this.prev.getValue(name);
        return undefined;
    }

    private setValueRecursive(name: string, value: Value): boolean {
        if (!this.prev) return false;
        if (this.values.has(name)) {
            this.values.set(name, value);
            return true;
        }
        return this.prev?.setValueRecursive(name, value);
    }

    setValue(name: string, value: Value) {
        if (!this.setValueRecursive(name, value)) this.values.set(name, value);
    }
}

export default LexicalEnvironment;

