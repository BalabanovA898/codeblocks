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
import { uuidv4 } from "../shared/functions";
import { globalStyles } from "../shared/globalStyles";

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
    onPickUp?: () => void;
}

const CodeBlockValue = (props: Props) => {
    let element: View | null;

    return (
        <Draggable
            key={uuidv4()}
            onDrop={props.onDrop}
            styles={styles.container}
            onPickUp={props.onPickUp}>
            <View
                ref={(view) => (element = view)}
                onLayout={(e) => {
                    element?.measure((x, y, w, h, px, py) => {
                        props.onLayout(px, py, w, h);
                    });
                }}
                style={styles.value}>
                <Select
                    selectedOption={props.type || "Тип"}
                    onSelect={(e) => {
                        props.setValue(props.value, e);
                        props.rerender();
                    }}
                    options={["string", "bool", "number"]}></Select>
                <TextInput
                    onChange={(e) => {
                        props.setValue(e.nativeEvent.text, props.type);
                    }}
                    onEndEditing={() => props.rerender()}
                    style={styles.text}>
                    {props.value || "Значение"}
                </TextInput>
            </View>
        </Draggable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FF7700",
        width: 0,
    },
    value: {
        flexDirection: "row",
        justifyContent: "center",
        padding: 0,
    },
    text: {
        fontFamily: globalStyles.fontFamily,
        fontSize: globalStyles.fontSize,
        color: globalStyles.backgroundColor,
        maxWidth: 150,
        maxHeight: 50,
        marginLeft: 7,
    },
});

export default CodeBlockValue;

