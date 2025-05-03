import { Key, RefObject } from "react";
import {
    GestureResponderEvent,
    PanResponderGestureState,
    View,
} from "react-native";
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
    ) => void;
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

    insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) {
        let isDropInChildren = this.children?.checkDropIn(g);
        if (this.checkDropIn(g) && !isDropInChildren) {
            //this.insert(codeBlock);
            console.log("YES");
        } else if (isDropInChildren)
            this.children?.insertCodeBlock(e, g, block);
        else if (this.next_) this.next_.insertCodeBlock(e, g, block);
        else {
            console.log("NO");
        }
    }
}

export default CCodeBlock;

