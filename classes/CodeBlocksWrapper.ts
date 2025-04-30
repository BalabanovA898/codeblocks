import CodeBlockFunction from "./CodeBlockFunction";

interface ICodeBlocksWrapper {
    codeBlocksFunction_: CodeBlockFunction;
}

class CodeBlocksWrapper implements ICodeBlocksWrapper {
    codeBlocksFunction_: CodeBlockFunction;

    constructor(codeBlocksFunction: CodeBlockFunction) {
        this.codeBlocksFunction_ = codeBlocksFunction;
    }

    get codeBlocksFunction() {
        return this.codeBlocksFunction_;
    }
}

export default CodeBlocksWrapper;

