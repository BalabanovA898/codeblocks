import LexicalEnvironment from "../../classes/Functional/LexicalEnvironment";

export default interface Executable {
    execute(le: LexicalEnvironment): void;
}

