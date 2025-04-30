import CodeBlock from "./CodeBlock";

interface ICodeBlocksTree {
    root_: CodeBlock;
}

class CodeBlocksTree implements ICodeBlocksTree {
    root_: CodeBlock;

    constructor(root: CodeBlock) {
        this.root_ = root;
    }

    get root() {
        return this.root_;
    }

    set root(newRoot: CodeBlock) {
        this.root_ = newRoot;
    }
}

export default CodeBlocksTree;

