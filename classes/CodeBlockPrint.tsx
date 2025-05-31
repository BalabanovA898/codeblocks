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
    onPickUp?: () => void;

    constructor(
        wrapper: CCodeBlockWrapper,
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: CCodeBlock
        ) => void,
        go: string[],
        gso: Dispatch<string[]>,
        onPickUp?: () => void,
        next: CCodeBlock | null = null,
        prev: CCodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(next, prev, parent);
        this.onDrop = onDrop;
        this.wrapper = wrapper;
        this.globalOutput = go;
        this.globalSetOutput = gso;
        this.onPickUp = onPickUp;
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
            let blockWrapper = new CCodeBlockWrapper(null, null);
            this.onDrop(
                e,
                g,
                new CCodeBlockPrint(
                    blockWrapper,
                    this.onDrop,
                    this.globalOutput,
                    this.globalSetOutput
                )
            );
        }
    }

    serialize() {
        return {
            type: "CCodeBlockPrint",
            id: this.id,
            wrapper: this.wrapper.serialize(),
            next: this.next ? this.next.serialize() : null,
        };
    }

    updateEventHandlers(onDrop: any, onPickUp?: any): void {
    this.onDrop = onDrop;
    this.onPickUp = onPickUp;
    
    if (this.wrapper) {
        this.wrapper.updateEventHandlers(onDrop, onPickUp);
    }
    
    if (this.next) {
        this.next.updateEventHandlers?.(onDrop, onPickUp);
    }
}

    static async deserialize(
    data: any,
    onDrop: any,
    go: string[],
    gso: Dispatch<string[]>,
    onPickUp?: any
): Promise<CCodeBlockPrint> {
    // Десериализуем обертку асинхронно
    const wrapper = await CCodeBlockWrapper.deserialize(data.wrapper);
    
    const block = new CCodeBlockPrint(wrapper, onDrop, go, gso, onPickUp);
    block.id = data.id;
    
    // Восстановление прототипа
    Object.setPrototypeOf(block, CCodeBlockPrint.prototype);
    
    // Привязка методов
    block.render = block.render.bind(block);
    block.execute = block.execute.bind(block);
    block.serialize = block.serialize.bind(block);
    block.insertCodeBlock = block.insertCodeBlock.bind(block);
    block.onDropHandler = block.onDropHandler.bind(block);
    
    // Десериализация следующего блока
    if (data.next) {
        block.next = await CCodeBlockWrapper.deserializeCodeBlock(data.next);
        if (block.next) {
            block.next.prev = block;
            block.next.parent = block.parent;
        }
    }
    
    return block;
}

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("Добавление в Print");
        if (this.checkDropIn(g)) {
            if (block.id === this.id) return true;
            if (this.wrapper.checkDropIn(g)) {
                return this.wrapper.insertCodeBlock(e, g, block);
            }
            this.pushCodeBlockAfterThis(block);
            return true;
        }
        if (this.next) return this.next.insertCodeBlock(e, g, block);
        return false;
    }

    render(props: any): JSX.Element {
        return (
            <CodeBlockPrint
                key={uuidv4()}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.setPositions.bind(this)}
                wrapper={this.wrapper}
                rerender={props.rerender}
                onPickUp={this.onPickUp}></CodeBlockPrint>
        );
    }
}

export default CCodeBlockPrint;

