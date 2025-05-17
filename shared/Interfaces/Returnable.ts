import LexicalEnvironment from "../../classes/Functional/LexicalEnvironment";
import Value from "../../classes/Functional/Value";

export default interface Returnable {
    execute(le: LexicalEnvironment): Value;
}

