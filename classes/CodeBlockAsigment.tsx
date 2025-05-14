import { Dispatch, Key } from "react";
import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import CodeBlockAssignment from "../components/CodeBlockAssignment";
import CCodeBlock from "./CodeBlock";

interface ICodeBlockAssignment {
    render_: (props: Props) => React.JSX.Element;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;
    parent: CCodeBlock | null;
    isNew: boolean;
}

interface Props {
    key: Key;
    onDrop: (e: GestureResponderEvent, g: PanResponderGestureState) => void;
}

class CCodeBlockAssignment implements ICodeBlockAssignment {
    render_: (props: Props) => React.JSX.Element;
    isNew: boolean;
    parent: CCodeBlock | null;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;

    constructor(
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: CCodeBlock
        ) => void,
        isNew: boolean,
        parent: CCodeBlock | null
    ) {
        this.render_ = CodeBlockAssignment;
        this.onDrop = onDrop;
        this.isNew = isNew;
        this.parent = parent;
    }

    onDropHandler(e: GestureResponderEvent, g: PanResponderGestureState) {
        if (this.parent) {
            this.parent.removeThisCodeBLock();
            this.onDrop(e, g, this.parent);
        } else
            this.onDrop(
                e,
                g,
                new CCodeBlock(
                    { x: 0, y: 0 },
                    new CCodeBlockAssignment(this.onDrop, false, null)
                )
            );
    }

    render(props: { key: Key }) {
        return this.render_({
            ...props,
            onDrop: this.onDropHandler.bind(this),
        });
    }
}

export default CCodeBlockAssignment;

