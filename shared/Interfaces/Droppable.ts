import {
    GestureResponderEvent,
    PanResponderGestureState,
    Animated,
} from "react-native";
import CCodeBlock from "../../classes/Functional/CodeBlock";

export default interface Droppable {
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;
    onDropHandler(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ): void;
}

