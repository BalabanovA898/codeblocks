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
import { uuidv4 } from "../shared/functions";
import { globalStyles } from "../shared/globalStyles";

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
    onPickUp?: () => void;
}

const CodeBlockGetVariableValue = (props: Props) => {
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
                }}>
                <TextInput
                    onChange={(e) => {
                        props.setValue(e.nativeEvent.text);
                    }}
                    style={{ ...styles.input, ...styles.text }}
                    onEndEditing={() => props.rerender()}>
                    {props.value || "Переменная"}
                </TextInput>
            </View>
        </Draggable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#AE00FF",
        width: 0,
    },
    input: {
        borderColor: globalStyles.backgroundColor,
        borderWidth: 2,
        padding: 0,
        paddingHorizontal: 5,
        borderRadius: 15,
        maxWidth: 170,
        maxHeight: 50,
        marginVertical: 0,
        marginHorizontal: 7,
    },
    text: {
        fontSize: globalStyles.fontSize,
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.backgroundColor,
    },
});

export default CodeBlockGetVariableValue;

