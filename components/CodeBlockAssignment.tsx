import {
    Text,
    StyleSheet,
    GestureResponderEvent,
    PanResponderGestureState,
} from "react-native";
import { Key } from "react";
import Draggable from "./Draggable";

interface Props {
    key: Key;
    onDrop: (e: GestureResponderEvent, g: PanResponderGestureState) => void;
}

const CodeBlockAssignment = (props: Props) => {
    return (
        <Draggable
            onDrop={props.onDrop}
            styles={styles.container}>
            <Text>a = 11</Text>
        </Draggable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#aaaa11",
        width: 200,
        margin: 4,
        zIndex: 100,
    },
});

export default CodeBlockAssignment;

