import {
    Animated,
    GestureResponderEvent,
    PanResponderGestureState,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Draggable from "./Draggable";
import { Children, DispatchWithoutAction, Key, PropsWithChildren } from "react";
import CCodeBlockWrapper from "../classes/CodeBlockWrapper";
import Select from "./Select";

interface Props {
    key: Key;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
    onLayout: (x: number, y: number, w: number, h: number) => void;
    wrapperLeft: CCodeBlockWrapper;
    wrapperRight: CCodeBlockWrapper;
    operator: string;
    setValue: (operator: string) => void;
    rerender: DispatchWithoutAction;
}

const CodeBlockMath = (props: Props & PropsWithChildren) => {
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
                {props.wrapperLeft.render({
                    key: Date.now(),
                    rerender: props.rerender,
                })}
                <Select
                    options={["+", "-", "/", "*", "pow", "mod"]}
                    onSelect={(e) => {
                        props.setValue(e);
                        props.rerender();
                    }}
                    selectedOption={props.operator}></Select>
                {props.wrapperRight.render({
                    key: Date.now(),
                    rerender: props.rerender,
                })}
            </View>
        </Draggable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        minHeight: 100,
        backgroundColor: "yellow",
        color: "white",
    },
    textColor: {
        color: "white",
    },
});

export default CodeBlockMath;

