import Returnable from "../../shared/Interfaces/Returnable";
import LexicalEnvironment from "./LexicalEnvironment";
import Value from "./Value";

interface Wrapper {
    codeBlock: Returnable;
    le: LexicalEnvironment;
    getValue(): Value;
}

class Wrapper implements Wrapper {
    codeBlock: Returnable;

    constructor(codeBlock: Returnable, prevLE: LexicalEnvironment | null) {
        this.codeBlock = codeBlock;
        this.le = new LexicalEnvironment(prevLE);
    }

    getValue(): Value {
        return this.codeBlock.execute(this.le);
    }
}

export default Wrapper;

