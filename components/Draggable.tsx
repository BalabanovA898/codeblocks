import { useRef, PropsWithChildren } from "react";
import {
    Animated,
    GestureResponderEvent,
    PanResponderGestureState,
    PanResponder,
    StyleSheet,
    StyleProp,
    StyleSheetProperties,
} from "react-native";

interface Props {
    onDrop: (e: GestureResponderEvent, g: PanResponderGestureState) => void;
    styles: any; //TODO: ПОТОМ ЗАГУГЛИТЬ КАК ЭТО ФИКСИТЬ.
}

const Draggable = (props: PropsWithChildren & Props) => {
    const position = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                null,
                {
                    dx: position.x,
                    dy: position.y,
                },
            ]),
            onPanResponderRelease: (e, g) => {
                props.onDrop(e, g);
                Animated.spring(new Animated.ValueXY(position), {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;
    return (
        <Animated.View
            style={[
                {
                    transform: position.getTranslateTransform(),
                    ...props.styles,
                },
            ]}
            key={Date.now()}
            {...panResponder.panHandlers}>
            {props.children}
        </Animated.View>
    );
};

export default Draggable;

