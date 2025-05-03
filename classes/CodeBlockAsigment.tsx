import { Dispatch, Key } from "react";
import {
    Animated,
    GestureResponderEvent,
    GestureResponderHandlers,
    PanResponderGestureState,
} from "react-native";
import CodeBlockAsigment from "../components/CodeBlockAsigment";
import Draggable from "./Draggable";
import CCodeBlock from "./CodeBlock";

interface ICodeBlockAsigment {
    render_: (props: Props) => React.JSX.Element;
}

interface Props {
    key: Key;
    panResponderHandlers: GestureResponderHandlers;
    position: Animated.ValueXY;
}

class CCodeBlockAsigment extends Draggable implements ICodeBlockAsigment {
    render_: (props: Props) => React.JSX.Element;
    constructor(
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: CCodeBlock
        ) => void
    ) {
        super(onDrop);
        this.render_ = CodeBlockAsigment;
    }

    render(props: { key: Key }) {
        return this.render_({
            ...props,
            panResponderHandlers: this.panResponder.panHandlers,
            position: this.position,
        });
    }
}

export default CCodeBlockAsigment;

