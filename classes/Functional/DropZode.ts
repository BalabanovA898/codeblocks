import { PanResponderGestureState, View } from "react-native";
import { Position } from "../../shared/types";

interface IDropZone {
    checkDropIn: (g: PanResponderGestureState) => Boolean;
    elementX: number | undefined;
    elementY: number | undefined;
    elementWidth: number | undefined;
    elementHeight: number | undefined;
    offset: Position;
}

class DropZone implements IDropZone {
    elementX: number | undefined;
    elementY: number | undefined;
    elementWidth: number | undefined;
    elementHeight: number | undefined;
    offset: Position;

    constructor(offset: Position) {
        this.offset = offset;
    }

    setPositions(x: number, y: number, w: number, h: number) {
        this.elementX = x + this.offset.x;
        this.elementY = y + this.offset.y;
        this.elementWidth = w;
        this.elementHeight = h;
    }

    checkDropIn(g: PanResponderGestureState) {
        console.log(
            "Position: ",
            this.elementX,
            this.elementY,
            this.elementWidth,
            this.elementHeight,
            g.moveX,
            g.moveY
        );
        if (
            !this.elementX ||
            !this.elementY ||
            !this.elementHeight ||
            !this.elementWidth
        )
            return false;
        if (
            g.moveX > this.elementX &&
            g.moveY > this.elementY &&
            g.moveX < this.elementX + this.elementWidth &&
            g.moveY < this.elementY + this.elementHeight
        )
            return true;
        return false;
    }
}

export default DropZone;

