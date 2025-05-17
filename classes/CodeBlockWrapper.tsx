import { Key } from "react";
import CCodeBlock from "./CodeBlock";
import {
    GestureResponderEvent,
    PanResponderGestureState,
    TouchableWithoutFeedbackBase,
} from "react-native";
import CodeBlockWrapper from "../components/CodeBlockWrapper";
import DropZone from "./Functional/DropZode";
import { Position, TYPES } from "../shared/types";
import Wrapper from "./Functional/Wrapper";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Returnable from "../shared/Interfaces/Returnable";
import Value from "./Functional/Value";

interface ICodeBlockWrapper {
    content: CCodeBlock;
    render_: (props: {
        key: Key;
        children: React.JSX.Element;
        onLayout: (x: number, y: number, w: number, h: number) => void;
    }) => React.JSX.Element;
    render: (props: Props) => React.JSX.Element;
    insertCodeBlock: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => boolean;
    le: LexicalEnvironment;
}

interface Props {
    key: Key;
}

class CCodeBlockWrapper
    extends DropZone
    implements ICodeBlockWrapper, Returnable
{
    content: CCodeBlock;
    render_: (props: {
        key: Key;
        children: React.JSX.Element;
        onLayout: (x: number, y: number, w: number, h: number) => void;
    }) => React.JSX.Element = CodeBlockWrapper;
    le: LexicalEnvironment;

    constructor(offset: Position, content: CCodeBlock, le: LexicalEnvironment) {
        super(offset);
        this.content = content;
        this.le = le;
    }

    render(props: Props) {
        return this.render_({
            onLayout: this.setPositions.bind(this),
            key: Date.now(),
            children: this.content.renderSequence({
                key: props.key,
            }),
        });
    }

    pushBackCodeBlock(newBlock: CCodeBlock) {
        if (!this.content) {
            this.content = newBlock;
            return;
        }
        let currentNode = this.content;
        while (currentNode.next) currentNode = currentNode.next;
        currentNode.next = newBlock;
    }

    insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) {
        console.log(this.content.checkDropIn(g));
        if (this.content.checkDropIn(g))
            return this.content.insertCodeBlock(e, g, block);
        else if (this.checkDropIn(g)) {
            this.pushBackCodeBlock(block);
            return true;
        }
        return false;
    }
    execute() {
        this.le = new LexicalEnvironment(this.le.prev);
        let valueToReturn: Value | null = null;
        let currentNode: CCodeBlock | null = this.content;
        while (currentNode) {
            valueToReturn = currentNode.execute(this.le);
            currentNode = currentNode.next;
        }
        return valueToReturn ? valueToReturn : new Value(TYPES.VOID, "");
    }
}

export default CCodeBlockWrapper;

