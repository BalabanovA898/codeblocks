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
}

interface Props {
    key: Key;
    onDrop: (e: GestureResponderEvent, g: PanResponderGestureState) => void;
}

class CCodeBlockAssignment implements ICodeBlockAssignment {
    render_: (props: Props) => React.JSX.Element;
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
        ) => void
    ) {
        this.render_ = CodeBlockAssignment;
        this.onDrop = onDrop;
    }

    onDropHandler(e: GestureResponderEvent, g: PanResponderGestureState) {
        this.onDrop(
            e,
            g,
            new CCodeBlock(
                { x: 0, y: 0 },
                new CCodeBlockAssignment(this.onDrop),
                null,
                null
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

