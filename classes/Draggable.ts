import { useRef } from "react";
import {
    Animated,
    GestureResponderEvent,
    PanResponder,
    PanResponderGestureState,
    PanResponderInstance,
} from "react-native";

interface IDraggable {
    panResponder: PanResponderInstance;
    position: Animated.ValueXY;
}

class Draggable implements IDraggable {
    panResponder: PanResponderInstance;
    position: Animated.ValueXY;
    constructor(
        onDrop: (e: GestureResponderEvent, g: PanResponderGestureState) => void
    ) {
        this.position = useRef(new Animated.ValueXY()).current;
        this.panResponder = useRef(
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderMove: Animated.event([
                    null,
                    {
                        dx: this.position.x,
                        dy: this.position.y,
                    },
                ]),
                onPanResponderRelease: (e, g) => {
                    onDrop(e, g);
                    Animated.spring(new Animated.ValueXY(this.position), {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                },
            })
        ).current;
    }
}

export default Draggable;

