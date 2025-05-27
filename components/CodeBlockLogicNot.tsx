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
    wrapper: CCodeBlockWrapper;
    rerender: DispatchWithoutAction;
}

const CodeBlockLogicNot = (props: Props & PropsWithChildren) => {
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
                }}
                style={styles.print}>
                <Text style={styles.text}>Not</Text>
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
        width: 0,
        backgroundColor: "#FF1115",
    },
    print: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    text: {
        fontSize: globalStyles.fontSize,
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.backgroundColor,
        marginRight: 10,
    },
});

export default CodeBlockLogicNot;


