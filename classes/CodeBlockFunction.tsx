import CodeBlock from "./CodeBlock";

interface ICodeBlockFunction {
    codeBlocksWrapper_: CodeBlock;
}

class CodeBlockFunction implements ICodeBlockFunction {
    codeBlocksWrapper_: CodeBlock;

    constructor(codeBlocksTree: CodeBlock) {
        this.codeBlocksWrapper_ = codeBlocksTree;
    }

    set codeBlocks(newCodeBlocks: CodeBlock) {
        this.codeBlocksWrapper_ = newCodeBlocks;
    }
    get codeBlocks() {
        return this.codeBlocksWrapper_;
    }
}

export default CodeBlockFunction;

