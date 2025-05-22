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

interface ICodeBlockPrint {
    wrapper: CCodeBlockWrapper;
    globalSetOutput: Dispatch<string[]>;
    globalOutput: string[];
}

class CCodeBlockPrint
    extends CCodeBlock
    implements Returnable, Renderable, Droppable, ICodeBlockPrint
{
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;
    wrapper: CCodeBlockWrapper;
    globalOutput: string[];
    globalSetOutput: Dispatch<string[]>;

    constructor(
        offset: Position,
        wrapper: CCodeBlockWrapper,
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: CCodeBlock
        ) => void,
        go: string[],
        gso: Dispatch<string[]>,
        next: CCodeBlock | null = null,
        prev: CCodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(offset, next, prev, parent);
        this.onDrop = onDrop;
        this.wrapper = wrapper;
        this.globalOutput = go;
        this.globalSetOutput = gso;
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
            this.removeThisCodeBLock.call(this);
            this.onDrop(e, g, this);
        } else {
            let blockWrapper = new CCodeBlockWrapper(this.offset, null, null);
            this.onDrop(
                e,
                g,
                new CCodeBlockPrint(
                    { x: 0, y: 0 },
                    blockWrapper,
                    this.onDrop,
                    this.globalOutput,
                    this.globalSetOutput
                )
            );
        }
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        if (this.checkDropIn(g)) {
            console.log("Insert inside the the print code block");
            if (this.wrapper.checkDropIn(g)) {
                return this.wrapper.insertCodeBlock(e, g, block);
            }
            this.pushCodeBlockAfterThis(block);
            return true;
        }
        if (this.next) return this.next.insertCodeBlock(e, g, block);
        return false;
    }

    onLayoutHandler(x: number, y: number, w: number, h: number): void {
        this.setPositions(x, y, w, h, 0, 0);
        this.wrapper.offset = {
            x: this.elementX || 0 + this.offset.x,
            y: this.offset.y,
        };
        if (this.next)
            this.next.offset = {
                x: this.offset.x,
                y: this.offset.y + (this.elementHeight || 0),
            };
    }

    render(props: any): JSX.Element {
        return (
            <CodeBlockPrint
                key={Date.now()}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.onLayoutHandler.bind(this)}
                wrapper={this.wrapper}
                rerender={props.rerender}></CodeBlockPrint>
        );
    }
    execute(le: LexicalEnvironment): Value {
        let output = this.wrapper.execute(new LexicalEnvironment(le));
        if (output.type === TypeVoid) {
            throw new Error("Значение для печати имеет тип void.");
        }
        this.globalSetOutput([
            ...this.globalOutput,
            new TypeString().convertFromOtherType(output.value),
        ]);
        console.log(this.globalOutput);
        return new Value(TypeVoid, "");
    }
}

export default CCodeBlockPrint;

