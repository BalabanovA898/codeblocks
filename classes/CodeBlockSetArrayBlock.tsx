import { DispatchWithoutAction, Key } from "react";
import {
    GestureResponderEvent,
    PanResponderGestureState,
    Animated,
} from "react-native";
import CodeBlockAssignment from "../components/CodeBlockAssignment";
import CCodeBlock from "./Functional/CodeBlock";
import Value from "./Functional/Value";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Returnable from "../shared/Interfaces/Returnable";
import TypeNumber from "./types/TypeNumber";
import Renderable from "../shared/Interfaces/Renderable";
import Droppable from "../shared/Interfaces/Droppable";
import { Position } from "../shared/types";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import TypeVoid from "./types/TypeVoid";
import CodeBlockGetArrayElement from "../components/CodeBlockGetArrayElement";
import CodeBlockSetArrayElement from "../components/CodeBlockSetArrayElement";

class CCodeBlockSetArrayElement
    extends CCodeBlock
    implements ICodeBlock, Renderable, Returnable, Droppable
{
    render_: (props: any) => React.JSX.Element;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) => void;
    nameToAssign: string | null;
    wrapperIndex: CCodeBlockWrapper;
    wrapperSet: CCodeBlockWrapper;
    onPickUp?: () => void;

    constructor(
        wrapperIndex: CCodeBlockWrapper,
        wrapperSet: CCodeBlockWrapper,
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: ICodeBlock
        ) => void,
        onPickUp?: () => void,
        next: CCodeBlock | null = null,
        prev: CCodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(next, prev, parent);
        this.render_ = CodeBlockAssignment;
        this.onDrop = onDrop;
        this.nameToAssign = null;
        this.wrapperIndex = wrapperIndex;
        this.wrapperSet = wrapperSet;
        this.onPickUp = onPickUp;
    }

    serialize() {}
    onDropHandler(e: GestureResponderEvent, g: PanResponderGestureState) {
        if (this.parent) {
            this.removeThisCodeBLock.call(this);
            this.onDrop(e, g, this);
        } else {
            let blockWrapperA = new CCodeBlockWrapper(null, null);
            let blockWrapperB = new CCodeBlockWrapper(null, null);
            this.onDrop(
                e,
                g,
                new CCodeBlockSetArrayElement(
                    blockWrapperA,
                    blockWrapperB,
                    this.onDrop
                )
            );
        }
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        if (this.checkDropIn.call(this, g)) {
            if (block.id === this.id) return true;
            if (this.wrapperIndex.checkDropIn(g)) {
                return this.wrapperIndex.insertCodeBlock(e, g, block);
            }
            if (this.wrapperSet.checkDropIn(g)) {
                return this.wrapperSet.insertCodeBlock(e, g, block);
            }
            this.pushCodeBlockAfterThis(block);
            return true;
        }
        if (this.next) {
            return this.next.insertCodeBlock(e, g, block);
        }
        return false;
    }

    setAssignmentState(name: string) {
        this.nameToAssign = name;
    }

    override render(props: { key: Key; rerender: DispatchWithoutAction }) {
        return (
            <CodeBlockSetArrayElement
                key={props.key}
                rerender={props.rerender}
                onDrop={this.onDropHandler.bind(this)}
                onChange={this.setAssignmentState.bind(this)}
                name={this.nameToAssign || ""}
                onLayout={this.setPositions.bind(this)}
                wrapperIndex={this.wrapperIndex}
                wrapperSet={this.wrapperSet}
                onPickUp={this.onPickUp}
            />
        );
    }
    execute(le: LexicalEnvironment): Value {
        if (!this.nameToAssign)
            throw new Error(
                "Ошибка блока присваивания в массив. Имя массива не может быть пустым."
            );
        if (!/([a-zA-Z][a-zA-Z0-9]*)/.test(this.nameToAssign))
            throw new Error(
                "Ошибка блока писваивания в массив. Имя массива должно начинаться с буквы латинского алфавита и содежать только буквы латинского алфавита и цифры."
            );
        if (le.getValue(`${this.nameToAssign}[0]`) === undefined)
            throw new Error(
                "Ошибка блока присваивания в массив. Массива с таким именем не существует"
            );
        let index = this.wrapperIndex.execute(new LexicalEnvironment(le));
        let value = this.wrapperSet.execute(new LexicalEnvironment(le));
        if (index.type === TypeVoid)
            throw new Error(
                "Ошибка блока присвавания в массив. Индекс не может юыть представлен типом Void"
            );
        if (value.type === TypeVoid)
            throw new Error(
                "Ошибка блока присваивания в массив. Невозможно присвоить тип Void"
            );
        if (!/\d+/.test(index.value.toString()))
            throw new Error(
                "Ошибка блока присваивания в массив. Индекс должен быть натуральным числом или нулём."
            );
        le.setValue(`${this.nameToAssign}[${index.value}]`, value);
        return new Value(TypeVoid, "");
    }
}

export default CCodeBlockSetArrayElement;

