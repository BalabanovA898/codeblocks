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

class CCodeBlockGetArrayElement
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
    wrapper: CCodeBlockWrapper;
    onPickUp?: () => void;

    constructor(
        wrapper: CCodeBlockWrapper,
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
        this.wrapper = wrapper;
        this.onPickUp = onPickUp;
    }

    onDropHandler(e: GestureResponderEvent, g: PanResponderGestureState) {
        if (this.parent) {
            this.removeThisCodeBLock.call(this);
            this.onDrop(e, g, this);
        } else {
            let blockWrapper = new CCodeBlockWrapper(null, null);
            this.onDrop(
                e,
                g,
                new CCodeBlockGetArrayElement(blockWrapper, this.onDrop)
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
            if (this.wrapper.checkDropIn(g)) {
                return this.wrapper.insertCodeBlock(e, g, block);
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
    serialize() {
        //TODO
    }
    override render(props: { key: Key; rerender: DispatchWithoutAction }) {
        return (
            <CodeBlockGetArrayElement
                key={props.key}
                rerender={props.rerender}
                onDrop={this.onDropHandler.bind(this)}
                onChange={this.setAssignmentState.bind(this)}
                name={this.nameToAssign || ""}
                onLayout={this.setPositions.bind(this)}
                wrapper={this.wrapper}
                onPickUp={this.onPickUp}
            />
        );
    }
    execute(le: LexicalEnvironment, contextReturn?: Value): Value {
        if (!this.nameToAssign)
            throw new Error(
                "Ошибка при создании переменной. Не назначено имя переменной"
            );
        if (!/([a-zA-Z][a-zA-Z0-9]*)/.test(this.nameToAssign))
            throw new Error(
                "Неправильное наименование переменных. Переменная должна начинаться с буквы, далее сожержать только буквы латинского алфавита и цифры."
            );

        let valueToAssign = this.wrapper.execute(new LexicalEnvironment(le));

        if (valueToAssign.type === TypeVoid)
            throw new Error(
                "Ошибка получение элемента из массива. Индекс должен быть целым числом."
            );

        if (!/\d+/.test(valueToAssign.value.toString()))
            throw new Error(
                "Ошибка получения эелемента из массива. Индекс должен быть натуральным числом или нулём."
            );
        console.log(`${this.nameToAssign}[${valueToAssign}]`);
        let result = le.getValue(
            `${this.nameToAssign}[${valueToAssign.value}]`
        );
        if (result === undefined)
            throw new Error(
                "Ошибка при полуение элемента из массива. Элемента под таким индексом или массива с таким именем не существует."
            );
        return result;
    }
}

export default CCodeBlockGetArrayElement;

