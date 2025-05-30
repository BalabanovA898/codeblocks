import {
    Text,
    StyleSheet,
    GestureResponderEvent,
    PanResponderGestureState,
    Animated,
    TextInput,
    TextInputChangeEventData,
    NativeSyntheticEvent,
    View,
} from "react-native";
import { Key, DispatchWithoutAction, PropsWithChildren } from "react";
import Draggable from "./Draggable";
import CCodeBlockWrapper from "../classes/CodeBlockWrapper";
import { uuidv4 } from "../shared/functions";
import { globalStyles } from "../shared/globalStyles";

interface Props {
    key: Key;
    name: string;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
    onChange: (name: string) => void;
    rerender: DispatchWithoutAction;
    onLayout: (x: number, y: number, w: number, h: number) => void;
    wrapper: CCodeBlockWrapper;
    onPickUp?: () => void;
}

const CodeBlockGetArrayElement = (props: Props & PropsWithChildren) => {
    let element: View | null;
    return (
        <Draggable
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
                <View style={styles.getArrayElementBlock}>
                    <TextInput
                        onChange={(
                            e: NativeSyntheticEvent<TextInputChangeEventData>
                        ) => {
                            props.onChange(e.nativeEvent.text);
                        }}
                        onEndEditing={() => props.rerender()}
                        style={{ ...styles.text, ...styles.input }}>
                        {props.name || "Из"}
                    </TextInput>
                    <Text style={styles.text}>По индексу</Text>
                </View>
                {props.wrapper.render({
                    key: uuidv4(),
                    rerender: props.rerender,
                })}
            </View>
        </Draggable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffbbbb",
        width: 0,
    },
    input: {
        borderColor: globalStyles.backgroundColor,
        borderWidth: 2,
        padding: 0,
        paddingHorizontal: 5,
        borderRadius: 15,
        maxWidth: 100,
        maxHeight: 50,
        marginVertical: 0,
        marginHorizontal: 7,
    },
    text: {
        fontSize: globalStyles.fontSize,
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.backgroundColor,
    },
    getArrayElementBlock: {
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
});

export default CodeBlockGetArrayElement;

