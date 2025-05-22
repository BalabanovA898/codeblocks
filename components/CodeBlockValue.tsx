import {
    Animated,
    GestureResponderEvent,
    PanResponderGestureState,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import Select from "./Select";
import { DispatchWithoutAction, useState } from "react";
import Draggable from "./Draggable";

interface Props {
    type: string;
    value: string;
    setValue: (type: string, value: string) => void;
    rerender: DispatchWithoutAction;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
    onLayout: (x: number, y: number, w: number, h: number) => void;
}

const CodeBlockValue = (props: Props) => {
    return (
        <Draggable
            key={Date.now()}
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
                <Select
                    selectedOption={props.type}
                    onSelect={(e) => {
                        props.setValue(props.value, e);
                        props.rerender();
                    }}
                    options={["string", "bool", "number"]}></Select>
                <TextInput
                    onChange={(e) => {
                        props.setValue(e.nativeEvent.text, props.type);
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
        backgroundColor: "green",
        minHeight: 100,
        minWidth: 100,
    },
});

export default CodeBlockValue;

