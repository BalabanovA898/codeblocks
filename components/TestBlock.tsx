import {
    StyleSheet,
    View,
    Text,
    Animated,
    PanResponder,
    PanResponderGestureState,
} from "react-native";
import { PropsWithChildren, useRef, useState } from "react";

interface Props {
    onDrop: (g: PanResponderGestureState, index: Number) => void;
}

const TestBlock = ({ children, onDrop }: Props & PropsWithChildren) => {
    const position = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                null,
                { dx: position.x, dy: position.y },
            ]),
            onPanResponderRelease: (e, g) => {
                onDrop(g, g.moveX);
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                }).start();
            },
        })
    ).current;
    return (
        <Animated.View
            style={{
                transform: position.getTranslateTransform(),
                ...styles.container,
            }}
            {...panResponder.panHandlers}>
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#171723",
        width: 100,
        height: 30,
    },
});

export default TestBlock;

