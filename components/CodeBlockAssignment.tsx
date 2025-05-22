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
}

const CodeBlockAssignment = (props: Props & PropsWithChildren) => {
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
                    onChange={(
                        e: NativeSyntheticEvent<TextInputChangeEventData>
                    ) => {
                        props.onChange(e.nativeEvent.text);
                    }}
                    onEndEditing={() => props.rerender()}>
                    {props.name || "Имя переменной"}
                </TextInput>
                <Text>=</Text>
                {props.wrapper.render({
                    key: Date.now(),
                    rerender: props.rerender,
                })}
            </View>
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

