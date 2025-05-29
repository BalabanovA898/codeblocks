import {
    GestureResponderEvent,
    PanResponderGestureState,
    Animated,
    View,
    Text,
} from "react-native";
import CodeBlockPrint from "../components/CodeBlockPrrint";
import Droppable from "../shared/Interfaces/Droppable";
import Renderable from "../shared/Interfaces/Renderable";
import Returnable from "../shared/Interfaces/Returnable";
import CCodeBlock from "./Functional/CodeBlock";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Value from "./Functional/Value";
import TypeNumber from "./types/TypeNumber";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import { Dispatch, DispatchWithoutAction, Key, useReducer } from "react";
import { Position } from "../shared/types";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import TypeString from "./types/TypeString";
import TypeVoid from "./types/TypeVoid";
import { uuidv4 } from "../shared/functions";
import CodeBlockBreak from "../components/CodeBlockBreak";

class CCodeBlockBreak
    extends CCodeBlock
    implements Returnable, Renderable, Droppable
{
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;

    constructor(
        offset: Position,
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: CCodeBlock
        ) => void,
        next: CCodeBlock | null = null,
        prev: CCodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(offset, next, prev, parent);
        this.onDrop = onDrop;
    }
    onDropHandler(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) {
        Animated.spring(new Animated.ValueXY(position), {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();
        if (this.parent) {
            this.removeThisCodeBLock();
            this.onDrop(e, g, this);
        } else {
            this.onDrop(e, g, new CCodeBlockBreak({ x: 0, y: 0 }, this.onDrop));
        }
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("Добавление в Break");
        if (this.checkDropIn(g)) {
            if (block.id === this.id) return true;
            this.pushCodeBlockAfterThis(block);
            return true;
        }
        if (this.next) return this.next.insertCodeBlock(e, g, block);
        return false;
    }

    render(props: any): JSX.Element {
        return (
            <CodeBlockBreak
                key={uuidv4()}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.setPositions.bind(this)}
                rerender={props.rerender}></CodeBlockBreak>
        );
    }
    execute(le: LexicalEnvironment): Value {
        return new Value(TypeNumber, "1");
    }
}

export default CCodeBlockBreak;

