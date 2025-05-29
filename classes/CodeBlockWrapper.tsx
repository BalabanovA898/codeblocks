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
import { uuidv4 } from "../shared/functions";
import TypeVoid from "./types/TypeVoid";

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

    constructor(content: ICodeBlock | null, parent: ICodeBlock | null = null) {
        super();
        this.content = content;
        this.parent = parent;
    }

    render(props: Props) {
        return this.render_({
            onLayout: this.setPositions.bind(this),
            key: uuidv4(),
            firstElement: this.content,
            rerender: props.rerender,
        });
    }

    pushBackCodeBlock(newBlock: ICodeBlock) {
        console.log("adding from wrapper");
        if (!this.content) return;
        let currentNode = this.content;
        while (currentNode.next) currentNode = currentNode.next;
        if (currentNode.id == newBlock.id) return;
        currentNode.next = newBlock;
        newBlock.parent = this;
        newBlock.prev = currentNode;
        newBlock.next = null;
    }

    insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) {
        console.log("Доабвление в Wrapper");
        if (this.checkDropIn(g)) {
            if (this.content == null) {
                this.content = block;
                this.content.parent = this;
                this.content.prev = null;
                this.content.next = null;
                return true;
            } else if (this.content !== null) {
                if (this.content.insertCodeBlock(e, g, block)) return true;
                else {
                    this.pushBackCodeBlock(block);
                    return true;
                }
            }
        }
        return false;
    }
    execute(le: LexicalEnvironment) {
        let valueToReturn: Value = new Value(TypeVoid, "");
        let currentNode = this.content;
        while (currentNode) {
            valueToReturn = currentNode.execute(le);
            currentNode = currentNode.next;
            if (valueToReturn.type !== TypeVoid) break;
        }
        return valueToReturn;
    }
}

export default CCodeBlockWrapper;

