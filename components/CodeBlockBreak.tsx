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
import { globalStyles } from "../shared/globalStyles";

interface Props {
    key: Key;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
    onLayout: (x: number, y: number, w: number, h: number) => void;
    rerender: DispatchWithoutAction;
}

const CodeBlockBreak = (props: Props & PropsWithChildren) => {
    let element: View | null;
    return (
        <Draggable
            onDrop={props.onDrop}
            styles={styles.container}>
            <View
                ref={(view) => (element = view)}
                onLayout={(e) => {
                    element?.measure((x, y, w, h, px, py) => {
                        props.onLayout(px, py, w, h);
                    });
                }}>
                <Text style={styles.text}>Break</Text>
            </View>
        </Draggable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 0,
        backgroundColor: "black",
    },
    text: {
        fontSize: globalStyles.fontSize,
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.fontColor,
    },
});

export default CodeBlockBreak;

