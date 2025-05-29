import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import Renderable from "./Renderable";
import Returnable from "./Returnable";
import { Position } from "../types";
import DropZone from "../../classes/Functional/DropZone";

export default interface ICodeBlock extends Renderable, Returnable, DropZone {
    next: ICodeBlock | null;
    prev: ICodeBlock | null;
    id: string;
    insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean;

    removeThisCodeBLock(): void;
}

