import { Key } from "react";
import CCodeBlock from "./CodeBlock";
import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import CodeBlockWrapper from "../components/CodeBlockWrapper";
import DropZone from "./DropZode";
import { Position } from "../types/types";

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
    ) => void;
}

interface Props {
    key: Key;
}

class CCodeBlockWrapper extends DropZone implements ICodeBlockWrapper {
    content: CCodeBlock;
    render_: (props: {
        key: Key;
        children: React.JSX.Element;
        onLayout: (x: number, y: number, w: number, h: number) => void;
    }) => React.JSX.Element = CodeBlockWrapper;

    constructor(offset: Position, content: CCodeBlock) {
        super(offset);
        this.content = content;
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

    insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) {
        console.log(this.content.checkDropIn(g));
        if (this.content.checkDropIn(g))
            this.content.insertCodeBlock(e, g, block);
        //else this.pushBack(codeBlock);
    }
}

export default CCodeBlockWrapper;

