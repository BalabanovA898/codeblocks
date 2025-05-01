import { Key } from "react";
import {
    Animated,
    GestureResponderEvent,
    GestureResponderHandlers,
    PanResponderGestureState,
} from "react-native";
import CodeBlockAsigment from "../components/CodeBlockAsigment";
import Draggable from "./Draggable";

interface ICodeBlockAsigment {
    render_: (props: Props) => React.JSX.Element;
}

interface Props {
    key: Key;
    panResponderHandlers: GestureResponderHandlers;
    position: Animated.ValueXY;
}

class CCodeBlockAsigment extends Draggable implements ICodeBlockAsigment {
    render_ = CodeBlockAsigment;

    constructor(
        onDrop: (e: GestureResponderEvent, g: PanResponderGestureState) => void
    ) {
        super(onDrop);
        this.panResponder.panHandlers;
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

