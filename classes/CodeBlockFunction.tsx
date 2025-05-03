import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import CCodeBlock from "./CodeBlock";

interface ICodeBlockFunction {
    codeBlocksWrapper_: CCodeBlockWrapper;
}

class CodeBlockFunction implements ICodeBlockFunction {
    codeBlocksWrapper_: CCodeBlockWrapper;

    constructor(codeBlocksTree: CCodeBlockWrapper) {
        this.codeBlocksWrapper_ = codeBlocksTree;
    }

    set codeBlocks(newCodeBlocks: CCodeBlockWrapper) {
        this.codeBlocksWrapper_ = newCodeBlocks;
    }
    get codeBlocks() {
        return this.codeBlocksWrapper_;
    }

    insertNewCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) {
        this.codeBlocks.insertCodeBlock(e, g, block);
    }
}

export default CodeBlockFunction;

