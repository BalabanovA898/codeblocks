import {
    Animated,
    GestureResponderEvent,
    PanResponderGestureState,
    StyleSheet,
    Text,
} from "react-native";
import Draggable from "./Draggable";
import { Children, Key, PropsWithChildren } from "react";

interface Props {
    key: Key;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
}

const CodeBlockPrint = (props: Props & PropsWithChildren) => {
    return (
        <Draggable
            onDrop={props.onDrop}
            styles={styles.container}>
            {props.children}
        </Draggable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 100,
        backgroundColor: "blue",
        color: "white",
    },
    textColor: {
        color: "white",
    },
});

export default CodeBlockPrint;

