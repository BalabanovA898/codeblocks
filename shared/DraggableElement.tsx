import { useState, useRef, PropsWithChildren } from "react";
import { Text, StyleSheet, Animated, PanResponder } from "react-native";

const DraggableElement = (props: PropsWithChildren) => {
    const position = useRef(new Animated.ValueXY()).current;
    let absolutePosition = new Animated.ValueXY(position);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
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
            onPanResponderRelease: (e, g) => {},
        })
    ).current;
    return (
        <Animated.View
            style={[
                { transform: position.getTranslateTransform() },
                styles.DraggableElement,
            ]}
            {...panResponder.panHandlers}>
            {props.children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    DraggableElement: {
        width: 100,
        height: 100,
        backgroundColor: "#ffff00",
        borderRadius: 50,
    },
});

export default DraggableElement;

