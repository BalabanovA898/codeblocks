import { DispatchWithoutAction, Key } from "react";
import CCodeBlock from "./CodeBlock";
import {
    GestureResponderEvent,
    PanResponderGestureState,
    TouchableWithoutFeedbackBase,
    View,
} from "react-native";
import CodeBlockWrapper from "../components/CodeBlockWrapper";
import DropZone from "./Functional/DropZode";
import { Position } from "../shared/types";
import Wrapper from "./Functional/Wrapper";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Returnable from "../shared/Interfaces/Returnable";
import Value from "./Functional/Value";
import TypeNumber from "./types/TypeNumber";

interface ICodeBlockWrapper {
    content: CCodeBlock | null;
    render_: (props: {
        key: Key;
        onLayout: (x: number, y: number, w: number, h: number) => void;
        firstElement: CCodeBlock | null;
        rerender: DispatchWithoutAction;
    }) => React.JSX.Element;
    render: (props: Props) => React.JSX.Element;
    insertCodeBlock: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => boolean;
    le: LexicalEnvironment | null;
    parent: CCodeBlock | null;
}

interface Props {
    key: Key;
    rerender: DispatchWithoutAction;
}

class CCodeBlockWrapper
    extends DropZone
    implements ICodeBlockWrapper, Returnable
{
    content: CCodeBlock | null;
    render_: (props: {
        key: Key;
        onLayout: (x: number, y: number, w: number, h: number) => void;
        firstElement: CCodeBlock | null;
        rerender: DispatchWithoutAction;
    }) => React.JSX.Element = CodeBlockWrapper;
    le: LexicalEnvironment | null;
    parent: CCodeBlock | null;

    constructor(
        offset: Position,
        content: CCodeBlock | null,
        le: LexicalEnvironment | null,
        parent: CCodeBlock | null = null
    ) {
        super(offset);
        this.content = content;
        this.le = le;
        this.parent = parent;
    }

    onLayoutHandler(x: number, y: number, w: number, h: number) {
        this.setPositions(
            x,
            y,
            w,
            h,
            this.parent?.elementX ? this.parent.elementX : 0,
            this.parent?.elementY ? this.parent.elementY : 0
        );
    }

    render(props: Props) {
        return this.render_({
            onLayout: this.onLayoutHandler.bind(this),
            key: Date.now(),
            firstElement: this.content,
            rerender: props.rerender,
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
        newBlock.parent = this;
    }

    insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) {
        console.log("trying to add in wrapper: ", this);
        if (this.content == null && this.checkDropIn(g)) {
            console.log("THIS WILL BE PLACED INSIDE THIS");
            this.content = block;
            this.content.le = new LexicalEnvironment(this.le);
            if (this.content.children)
                this.content.children.le = new LexicalEnvironment(
                    this.content.le
                );
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
    execute() {
        if (!this.le) {
            throw new Error(
                "Блок не располагает доступом к лксическому окружению. Произошла ошибка интерпритации."
            );
        }
        this.le = new LexicalEnvironment(this.le.prev);
        let valueToReturn: Value | null = null;
        let currentNode: CCodeBlock | null = this.content;
        while (currentNode) {
            valueToReturn = currentNode.execute(this.le);
            currentNode = currentNode.next;
        }
        return valueToReturn ? valueToReturn : new Value(TypeNumber, "");
    }
}

export default CCodeBlockWrapper;

