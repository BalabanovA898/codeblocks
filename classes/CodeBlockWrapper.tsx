import { DispatchWithoutAction, Key } from "react";
import CCodeBlock from "./Functional/CodeBlock";
import {
    GestureResponderEvent,
    PanResponderGestureState,
    TouchableWithoutFeedbackBase,
    View,
} from "react-native";
import CodeBlockWrapper from "../components/CodeBlockWrapper";
import DropZone from "./Functional/DropZone";
import { Position } from "../shared/types";
import Wrapper from "./Functional/Wrapper";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Returnable from "../shared/Interfaces/Returnable";
import Value from "./Functional/Value";
import TypeNumber from "./types/TypeNumber";
import ICodeBlock from "../shared/Interfaces/CodeBlock";

interface ICodeBlockWrapper {
    content: ICodeBlock | null;
    render_: (props: {
        key: Key;
        onLayout: (x: number, y: number, w: number, h: number) => void;
        firstElement: ICodeBlock | null;
        rerender: DispatchWithoutAction;
    }) => React.JSX.Element;
    render: (props: Props) => React.JSX.Element;
    insertCodeBlock: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) => boolean;
    parent: ICodeBlock | null;
}

interface Props {
    key: Key;
    rerender: DispatchWithoutAction;
}

class CCodeBlockWrapper
    extends DropZone
    implements ICodeBlockWrapper, Returnable
{
    content: ICodeBlock | null;
    render_: (props: {
        key: Key;
        onLayout: (x: number, y: number, w: number, h: number) => void;
        firstElement: ICodeBlock | null;
        rerender: DispatchWithoutAction;
    }) => React.JSX.Element = CodeBlockWrapper;
    parent: ICodeBlock | null;

    constructor(
        offset: Position,
        content: ICodeBlock | null,
        parent: ICodeBlock | null = null
    ) {
        super(offset);
        this.content = content;
        this.parent = parent;
    }

    onLayoutHandler(x: number, y: number, w: number, h: number) {
        this.setPositions(x, y, w, h, 0, this.parent?.offset.y || 0);
    }

    render(props: Props) {
        return this.render_({
            onLayout: this.onLayoutHandler.bind(this),
            key: Date.now(),
            firstElement: this.content,
            rerender: props.rerender,
        });
    }

    pushBackCodeBlock(newBlock: ICodeBlock) {
        if (!this.content) return;
        let currentNode = this.content;
        while (currentNode.next) currentNode = currentNode.next;
        currentNode.next = newBlock;
        newBlock.parent = this;
        newBlock.offset = { x: currentNode.offset.x, y: currentNode.offset.y };
    }

    insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) {
        console.log("trying to add in wrapper: ", this);
        if (this.content == null && this.checkDropIn(g)) {
            console.log("THIS WILL BE PLACED INSIDE THIS");
            this.content = block;
            this.content.parent = this;
            this.content.offset = this.offset;
            return true;
        } else if (this.content !== null) {
            if (this.checkDropIn(g))
                if (this.content.insertCodeBlock(e, g, block)) return true;
                else {
                    this.pushBackCodeBlock(block);
                    return true;
                }
        }
        return false;
    }
    execute(le: LexicalEnvironment) {
        let valueToReturn: Value | null = null;
        let currentNode = this.content;
        while (currentNode) {
            valueToReturn = currentNode.execute(le);
            currentNode = currentNode.next;
        }
        return valueToReturn ? valueToReturn : new Value(TypeNumber, "");
    }
}

export default CCodeBlockWrapper;

