import { Key, RefObject } from "react";
import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import { Position, RenderContent } from "../types/types";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import DropZone from "./DropZode";
import CodeBlock from "../components/CodeBlock";

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
    render_: (props: Props) => React.JSX.Element;
    renderSequence: (props: { key: Key }) => React.JSX.Element;
    insertCodeBlock: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => boolean;
}

class CCodeBlock extends DropZone implements ICodeBlock {
    content_: RenderContent | null;
    next_: CCodeBlock | null;
    children: CCodeBlockWrapper | null;
    render_: (props: Props) => React.JSX.Element;

    constructor(
        offset: Position,
        content: RenderContent | null,
        next: CCodeBlock | null,
        children: CCodeBlockWrapper | null
    ) {
        super(offset);
        this.content_ = content;
        this.next_ = next;
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
        let tmp = this.next;
        this.next = newBLock;
        this.next.next = tmp;
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
}

export default CCodeBlock;

