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
    onPickUp?: () => void;

    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;

    constructor(
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: CCodeBlock
        ) => void,
        onPickUp?: () => void,
        next: ICodeBlock | null = null,
        prev: ICodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(next, prev, parent);
        this.onDrop = onDrop;
        this.onPickUp = onPickUp;
    }

    onDropHandler(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ): void {
        if (this.parent) {
            this.removeThisCodeBLock();
            this.onDrop(e, g, this);
        } else this.onDrop(e, g, new CCodeBlockValue(this.onDrop));
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("Добавление в Value");
        if (this.checkDropIn.call(this, g)) {
            if (block.id === this.id) return true;
            this.pushCodeBlockAfterThis(block);
            return true;
        }
        if (this.next) {
            return this.next.insertCodeBlock(e, g, block);
        }
        return false;
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
                onLayout={this.setPositions.bind(this)}
                onPickUp={this.onPickUp}></CodeBlockValue>
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

