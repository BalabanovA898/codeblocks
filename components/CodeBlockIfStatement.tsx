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
import { uuidv4 } from "../shared/functions";

interface Props {
    key: Key;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
    onLayout: (x: number, y: number, w: number, h: number) => void;
    wrapperIf: CCodeBlockWrapper;
    wrapperThen: CCodeBlockWrapper;
    wrapperElse: CCodeBlockWrapper;
    rerender: DispatchWithoutAction;
}

const CodeBlockIfStatement = (props: Props & PropsWithChildren) => {
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
                <Text>If</Text>
                {props.wrapperIf.render({
                    key: uuidv4(),
                    rerender: props.rerender,
                })}
                <Text>Then</Text>
                {props.wrapperThen.render({
                    key: uuidv4(),
                    rerender: props.rerender,
                })}
                <Text>Else</Text>
                {props.wrapperElse.render({
                    key: uuidv4(),
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
        backgroundColor: "white",
    },
    textColor: {
        color: "black",
    },
});

export default CodeBlockIfStatement;

