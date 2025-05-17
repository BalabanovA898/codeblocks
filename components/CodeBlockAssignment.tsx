import {
    Text,
    StyleSheet,
    GestureResponderEvent,
    PanResponderGestureState,
    Animated,
    TextInput,
    TextInputChangeEventData,
    NativeSyntheticEvent,
} from "react-native";
import {
    Key,
    useEffect,
    useState,
    useReducer,
    DispatchWithoutAction,
} from "react";
import Draggable from "./Draggable";
import Value from "../classes/Functional/Value";
import Select from "./Select";

interface Props {
    key: Key;
    type: string;
    name: string;
    value: string;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
    onChange: (name: string, value: string, type: string) => void;
    rerender: DispatchWithoutAction;
}

const CodeBlockAssignment = (props: Props) => {
    return (
        <Draggable
            onDrop={props.onDrop}
            styles={styles.container}>
            <Select
                selectedOption={props.type}
                onSelect={(item: string) => {
                    props.onChange(props.name, props.value, item);
                    props.rerender();
                }}
                options={["string", "number", "bool"]}></Select>
            <TextInput
                onChange={(
                    e: NativeSyntheticEvent<TextInputChangeEventData>
                ) => {
                    props.onChange(e.nativeEvent.text, props.value, props.type);
                }}>
                {props.name || "Имя переменной"}
            </TextInput>
            <Text>=</Text>
            <TextInput
                onChange={(
                    e: NativeSyntheticEvent<TextInputChangeEventData>
                ) => {
                    props.onChange(props.value, e.nativeEvent.text, props.type);
                }}>
                {props.value || "Значание"}
            </TextInput>
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

