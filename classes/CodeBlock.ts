import CCodeBlockAsigment from "./CodeBlockAsigment";

type Content = CCodeBlockAsigment;

interface ICodeBlock {
    content_: Content;
    next_: CodeBlock | null;
    prev_: CodeBlock | null;
}

class CodeBlock implements ICodeBlock {
    content_: Content;
    next_: CodeBlock | null;
    prev_: CodeBlock | null;

    constructor(
        content: Content,
        next: CodeBlock | null,
        prev: CodeBlock | null
    ) {
        this.content_ = content;
        this.next_ = next;
        this.prev_ = prev;
    }

    get content() {
        return this.content_;
    }

    get next() {
        return this.next_;
    }
}

export default CodeBlock;

