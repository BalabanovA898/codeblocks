import {
    Animated,
    GestureResponderEvent,
    PanResponderGestureState,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { DispatchWithoutAction, useState } from "react";
import Draggable from "./Draggable";

interface Props {
    value: string;
    setValue: (value: string) => void;
    rerender: DispatchWithoutAction;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
    onLayout: (x: number, y: number, w: number, h: number) => void;
}

const CodeBlockGetVariableValue = (props: Props) => {
    return (
        <Draggable
            onDrop={props.onDrop}
            styles={styles.container}>
            <View
                onLayout={(e) => {
                    props.onLayout(
                        e.nativeEvent.layout.x,
                        e.nativeEvent.layout.y,
                        e.nativeEvent.layout.width,
                        e.nativeEvent.layout.height
                    );
                }}>
                <TextInput
                    onChange={(e) => {
                        props.setValue(e.nativeEvent.text);
                    }}
                    onEndEditing={() => props.rerender()}>
                    {props.value || "Значение"}
                </TextInput>
            </View>
        </Draggable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "purple",
        minHeight: 100,
        minWidth: 100,
    },
});

export default CodeBlockGetVariableValue;

