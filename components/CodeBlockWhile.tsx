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
import { globalStyles } from "../shared/globalStyles";

interface Props {
    key: Key;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
    onLayout: (x: number, y: number, w: number, h: number) => void;
    wrapperWhile: CCodeBlockWrapper;
    wrapperDo: CCodeBlockWrapper;
    rerender: DispatchWithoutAction;
    onPickUp?: () => void;
}

const CodeBlockWhile = (props: Props & PropsWithChildren) => {
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
                <Text style={styles.text}>While</Text>
                {props.wrapperWhile.render({
                    key: uuidv4(),
                    rerender: props.rerender,
                })}
                <Text style={styles.text}>Do</Text>
                {props.wrapperDo.render({
                    key: uuidv4(),
                    rerender: props.rerender,
                })}
            </View>
        </Draggable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 0,
        backgroundColor: "#FF00D0",
    },
    text: {
        fontSize: globalStyles.fontSize,
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.backgroundColor,
    },
});

export default CodeBlockWhile;

