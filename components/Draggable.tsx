import { useRef, PropsWithChildren } from "react";
import {
    Animated,
    GestureResponderEvent,
    PanResponderGestureState,
    PanResponder,
    View,
    StyleSheet,
} from "react-native";
import { uuidv4 } from "../shared/functions";
import { transform } from "@babel/core";
import { globalStyles } from "../shared/globalStyles";

interface Props {
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
    styles: any;
    onPickUp?: () => void;
}

const Draggable = (props: PropsWithChildren & Props) => {
    const position = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => false,
            onPanResponderStart: () => {
                if (props.onPickUp) props.onPickUp();
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    {
                        dx: position.x,
                        dy: position.y,
                    },
                ],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (e, g) => {
                props.onDrop(e, g, position);
            },
        })
    ).current;
    return (
        <Animated.View
            style={[
                {
                    transform: position.getTranslateTransform(),
                    ...styles.container,
                },
            ]}
            key={uuidv4()}
            {...panResponder.panHandlers}>
            <View style={styles.top}>
                <View
                    style={{
                        width: 50,
                        minWidth: 0,
                        backgroundColor: props.styles.backgroundColor,
                        borderTopLeftRadius: 15,
                    }}></View>
                <View
                    style={{
                        ...styles.topTriangleLeft,
                        borderBottomColor: props.styles.backgroundColor,
                    }}></View>
                <View
                    style={{
                        ...styles.topTriangleRight,
                        borderTopColor: props.styles.backgroundColor,
                    }}></View>
                <View
                    style={{
                        ...styles.topItem,
                        backgroundColor: props.styles.backgroundColor,
                        borderTopRightRadius: 15,
                    }}></View>
            </View>
            <View style={{ ...props.styles, ...styles.content }}>
                {props.children}
            </View>
            <View
                style={{
                    ...styles.bottomTriangle,
                    borderBottomColor: props.styles.backgroundColor,
                }}></View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    top: {
        position: "absolute",
        top: -15,
        height: 15,
        minWidth: 230,
        flexDirection: "row",
    },
    topItem: {
        flexGrow: 1,
    },
    topTriangleLeft: {
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderBottomWidth: 15,
        borderRightWidth: 7.5,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
    },
    topTriangleRight: {
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: 7.5,
        borderTopWidth: 15,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        transform: [{ rotateZ: "180deg" }],
    },
    bottomTriangle: {
        position: "absolute",
        height: 0,
        width: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderBottomWidth: 15,
        borderRightWidth: 7.5,
        borderLeftWidth: 7.5,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "red",
        transform: [{ rotateZ: "180deg" }],
        left: 50,
        bottom: -15,
    },
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        marginTop: 15,
        opacity: globalStyles.blockOpacity,
    },
    content: {
        padding: 10,
        margin: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderRadius: 15,
        minWidth: 230,
    },
});

export default Draggable;

