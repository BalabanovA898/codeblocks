import {
    GestureResponderEvent,
    PanResponderGestureState,
    Animated,
} from "react-native";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import Droppable from "../shared/Interfaces/Droppable";
import Renderable from "../shared/Interfaces/Renderable";
import Returnable from "../shared/Interfaces/Returnable";
import CCodeBlock from "./Functional/CodeBlock";
import { Position } from "../shared/types";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import CodeBlockValue from "../components/CodeBlockValue";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Value from "./Functional/Value";
import TypeVoid from "./types/TypeVoid";
import { convertFrom, getTypeByString } from "../shared/functions";
import CodeBlockGetVariableValue from "../components/CodeBlockGetVariable";

interface ICodeBlockValue {
    valueToGet: string | null;
}

export default class CCodeBlockGetVariableValue
    extends CCodeBlock
    implements ICodeBlockValue, Renderable, Returnable, Droppable, ICodeBlock
{
    valueToGet: string | null = null;

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
        next: ICodeBlock | null = null,
        prev: ICodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(offset, next, prev, parent);
        this.onDrop = onDrop;
    }

    onDropHandler(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ): void {
        if (this.parent) {
            this.removeThisCodeBLock();
            this.onDrop(e, g, this);
        } else
            this.onDrop(
                e,
                g,
                new CCodeBlockGetVariableValue(
                    { x: 0, y: 0 },
                    this.onDrop,
                    null
                )
            );
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("1231231231");
        if (this.checkDropIn.call(this, g)) {
            this.pushCodeBlockAfterThis(block);
            return true;
        }
        if (this.next) {
            return this.next.insertCodeBlock(e, g, block);
        }
        return false;
    }

    onLayoutHandler(x: number, y: number, w: number, h: number): void {
        this.setPositions(x, y, w, h, 0, 0);
        if (this.next)
            this.next.offset = {
                x: this.offset.x,
                y: this.offset.y + (this.elementHeight || 0),
            };
    }

    setAssignmentState(value: string) {
        this.valueToGet = value;
    }

    render(props: any) {
        return (
            <CodeBlockGetVariableValue
                value={this.valueToGet || ""}
                setValue={this.setAssignmentState.bind(this)}
                rerender={props.rerender}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.onLayoutHandler.bind(
                    this
                )}></CodeBlockGetVariableValue>
        );
    }

    execute(le: LexicalEnvironment): Value {
        if (!this.valueToGet)
            throw new Error(
                "Ошибка получения значение переменной. Необзодимо указать имя переменной."
            );
        let res = le.getValue(this.valueToGet);
        if (!res)
            throw new Error(
                `Ошибка получения значения переменной. Нет переменной с именем ${this.valueToGet}`
            );
        return res;
    }
}

