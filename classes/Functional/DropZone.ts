import { PanResponderGestureState, View } from "react-native";
import { Position } from "../../shared/types";

interface IDropZone {
    checkDropIn: (g: PanResponderGestureState) => Boolean;
    elementX: number | undefined;
    elementY: number | undefined;
    elementWidth: number | undefined;
    elementHeight: number | undefined;
}

class DropZone implements IDropZone {
    elementX: number | undefined;
    elementY: number | undefined;
    elementWidth: number | undefined;
    elementHeight: number | undefined;

    constructor() {}

    setPositions(x: number, y: number, w: number, h: number) {
        this.elementX = x;
        this.elementY = y;
        this.elementWidth = w;
        this.elementHeight = h;
    }

    checkDropIn(g: PanResponderGestureState) {
        console.log(
            this.elementX,
            this.elementY,
            this.elementWidth,
            this.elementHeight,
            g.moveX,
            g.moveY
        );
        if (
            this.elementX !== undefined &&
            this.elementY !== undefined &&
            this.elementHeight !== undefined &&
            this.elementWidth !== undefined
        ) {
            if (
                g.moveX > this.elementX &&
                g.moveY > this.elementY &&
                g.moveX < this.elementX + this.elementWidth &&
                g.moveY < this.elementY + this.elementHeight
            )
                return true;
        }
        return false;
    }
}

export default DropZone;

