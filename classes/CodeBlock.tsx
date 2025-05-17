import { Key, RefObject } from "react";
import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import { Position, RenderContent } from "../shared/types";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import DropZone from "./Functional/DropZode";
import CodeBlock from "../components/CodeBlock";
import Executable from "../shared/Interfaces/Executable";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Returnable from "../shared/Interfaces/Returnable";
import Value from "./Functional/Value";

interface Props {
    key: Key;
    renderArray: Array<RenderContent | null>;
    children: CCodeBlockWrapper | null;
    onLayout: (x: number, y: number, w: number, h: number) => void;
}

interface ICodeBlock {
    content_: RenderContent | null;
    children: CCodeBlockWrapper | null;
    next_: CCodeBlock | null;
    prev_: CCodeBlock | null;
    render_: (props: Props) => React.JSX.Element;
    renderSequence: (props: { key: Key }) => React.JSX.Element;
    insertCodeBlock: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => boolean;
}

class CCodeBlock extends DropZone implements ICodeBlock, Returnable {
    content_: RenderContent | null;
    children: CCodeBlockWrapper | null;
    next_: CCodeBlock | null;
    prev_: CCodeBlock | null;
    render_: (props: Props) => React.JSX.Element;

    constructor(
        offset: Position,
        content: RenderContent | null,
        next: CCodeBlock | null = null,
        prev: CCodeBlock | null = null,
        children: CCodeBlockWrapper | null = null
    ) {
        super(offset);
        this.content_ = content;
        if (this.content !== null) this.content.parent = this;
        this.next_ = next;
        this.prev_ = prev;
        this.children = children;
        this.render_ = CodeBlock;
    }

    get content() {
        return this.content_;
    }

    get next() {
        return this.next_;
    }

    set next(item: CCodeBlock | null) {
        this.next_ = item;
    }

    get prev() {
        return this.prev_;
    }

    set prev(block: CCodeBlock | null) {
        this.prev_ = block;
    }

    renderSequence(props: { key: Key }) {
        let renderArray = [];
        let currentNode: CCodeBlock | null = this;

        while (currentNode) {
            renderArray.push(currentNode.content);
            currentNode = currentNode.next;
        }
        return this.render_({
            key: props.key,
            renderArray: renderArray,
            children: this.children,
            onLayout: this.setPositions.bind(this),
        });
    }

    pushCodeBlockAfterThis(newBLock: CCodeBlock) {
        console.log("I've been added from CodeBlock");
        let tmp = this.next;
        this.next = newBLock;
        if (tmp) tmp.prev = newBLock;
        newBLock.next = tmp;
        newBLock.prev = this;
        console.log(this.next);
    }

    removeThisCodeBLock() {
        if (this.prev) {
            this.prev.next = this.next;
            if (this.next) this.next.prev = this.prev;
        }
    }

    insertCodeBlock = (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ): boolean => {
        let isDropInChildren = this.children?.checkDropIn(g);
        if (this.checkDropIn(g) && !isDropInChildren) {
            this.pushCodeBlockAfterThis(block);
            console.log("YES");
            return true;
        } else if (isDropInChildren && this.children)
            return this.children.insertCodeBlock(e, g, block);
        else if (this.next_) return this.next_.insertCodeBlock(e, g, block);
        else {
            return false;
        }
    };

    execute(le: LexicalEnvironment): Value {
        if (this.content) return this.content.execute(le);
        throw new Error(
            "Ошибка при попытке выполинть команду! Ощиюка может быть вызвана пустыми полями."
        );
    }
}

export default CCodeBlock;

