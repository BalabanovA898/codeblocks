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
import CodeBlockArrayInit from "../components/CodeBlockArrayInit";

export default class CCodeBlockArrayInit
    extends CCodeBlock
    implements Renderable, Returnable, Droppable, ICodeBlock
{
    nameToAssign: string | null = null;
    typeToAssign: string | null = null;
    numberOfElement: string | null = null;

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
                new CCodeBlockArrayInit({ x: 0, y: 0 }, this.onDrop, null)
            );
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("Добавление в ArrayInit");
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

    onLayoutHandler(x: number, y: number, w: number, h: number): void {
        this.setPositions(x, y, w, h, 0, 0);
        if (this.next)
            this.next.offset = {
                x: this.offset.x,
                y: this.offset.y + (this.elementHeight || 0),
            };
    }

    setAssignmentState(name: string, type: string, numberOfElement: string) {
        this.nameToAssign = name;
        this.typeToAssign = type;
        this.numberOfElement = numberOfElement;
    }

    render(props: any) {
        return (
            <CodeBlockArrayInit
                type={this.typeToAssign || ""}
                name={this.nameToAssign || ""}
                numberOfElement={this.numberOfElement || ""}
                setValue={this.setAssignmentState.bind(this)}
                rerender={props.rerender}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.onLayoutHandler.bind(this)}></CodeBlockArrayInit>
        );
    }

    execute(le: LexicalEnvironment): Value {
        if (!this.nameToAssign)
            throw new Error(
                "Ошибка блока инициализации массива. Имя не может быть пустым."
            );
        if (!this.numberOfElement)
            throw new Error(
                "Ошибка блока инициализации массива. Необходимо указать количество элементов."
            );
        if (!this.typeToAssign)
            throw new Error(
                "Ошибка блока инициализации массива. Необхожимо указать тип массива."
            );
        if (
            !/^ *[a-zA-Z][a-zA-Z0-9]* *( *, *[a-zA-Z][a-zA-Z0-9]* *)*\b/.test(
                this.nameToAssign
            )
        )
            throw new Error(
                "Неправильное наименование переменных. Переменная должна начинаться с буквы, далее сожержать только буквы латинского алфавита и цифры. Допускается передача нескольих имен переменных через запятую."
            );
        if (!/[1-9]\d*/.test(this.numberOfElement))
            throw new Error(
                "Ошибка блока инициализации массива. Количество элементов должно быть натуральным числом."
            );
        for (let i = 0; i < Number(this.numberOfElement); ++i) {
            le.setValue(
                `${this.nameToAssign}[${i}]`,
                new Value(getTypeByString(this.typeToAssign), "0")
            );
        }
        return new Value(TypeVoid, "");
    }
}

