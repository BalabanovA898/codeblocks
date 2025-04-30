import CodeBlocksTree from "./CodeBlocksTree";

interface ICodeBlockFunction {
    codeBlocks_: CodeBlocksTree;
}

class CodeBlockFunction implements ICodeBlockFunction {
    codeBlocks_: CodeBlocksTree;

    constructor(codeBlocksTree: CodeBlocksTree) {
        this.codeBlocks_ = codeBlocksTree;
    }

    get codeBlocks() {
        return this.codeBlocks_;
    }

    set codeBlocks(newCodeBlocks: CodeBlocksTree) {
        this.codeBlocks_ = newCodeBlocks;
    }
}

export default CodeBlockFunction;

