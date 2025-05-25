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
import { getTypeByString } from "../shared/functions";

interface ICodeBlockValue {
    valueToAssign: string | null;
    typeToAssign: string | null;
}

export default class CCodeBlockValue
    extends CCodeBlock
    implements ICodeBlockValue, Renderable, Returnable, Droppable, ICodeBlock
{
    valueToAssign: string | null = null;
    typeToAssign: string | null = null;

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
                new CCodeBlockValue({ x: 0, y: 0 }, this.onDrop, null)
            );
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("Добавление в Value");
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

    setAssignmentState(value: string, type: string) {
        this.valueToAssign = value;
        this.typeToAssign = type;
    }

    render(props: any) {
        return (
            <CodeBlockValue
                type={this.typeToAssign || ""}
                value={this.valueToAssign || ""}
                setValue={this.setAssignmentState.bind(this)}
                rerender={props.rerender}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.onLayoutHandler.bind(this)}></CodeBlockValue>
        );
    }

    execute(le: LexicalEnvironment): Value {
        if (!this.typeToAssign)
            throw new Error("Ошибка значения. Необходимо указать тип");
        if (this.valueToAssign === null)
            throw new Error("Ошибка значения. Значение не может быть пустым");
        let type = getTypeByString(this.typeToAssign);
        return new Value(type, new type().convertFrom(this.valueToAssign));
    }
}

