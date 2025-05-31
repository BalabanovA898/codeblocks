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
import { uuidv4 } from "../shared/functions";
import { deserializeAnyBlock } from "./Functional/BlockDeserializer";

interface ICodeBlockAssignment {
    nameToAssign: string | null;
    wrapper: CCodeBlockWrapper;
}

class CCodeBlockAssignment
    extends CCodeBlock
    implements
        ICodeBlock,
        ICodeBlockAssignment,
        Renderable,
        Returnable,
        Droppable
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
    id: string;

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
        this.id = uuidv4();

        this.render = this.render.bind(this);
        this.onDropHandler = this.onDropHandler.bind(this);
        this.insertCodeBlock = this.insertCodeBlock.bind(this);
        this.setAssignmentState = this.setAssignmentState.bind(this);
        this.execute = this.execute.bind(this);
        delete (this as any).globalOutput;
        delete (this as any).globalSetOutput;
    }

    onDropHandler(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) {
        if (this.parent) {
            this.removeThisCodeBLock.call(this);
            this.onDrop(e, g, this);
        } else {
            let blockWrapper = new CCodeBlockWrapper(null, null);
            this.onDrop(
                e,
                g,
                new CCodeBlockAssignment(blockWrapper, this.onDrop)
            );
        }
    }

    serialize() {
        return {
            type: "CCodeBlockAssignment",
            id: this.id,
            nameToAssign: this.nameToAssign,
            wrapper: this.wrapper.serialize(),
            next: this.next ? this.next.serialize() : null,
        };
    }

    static async deserialize(
        data: any,
        onDrop: any,
        onPickUp?: any
    ): Promise<CCodeBlockAssignment> {
        // Защита от отсутствия wrapper
        if (!data.wrapper) {
            console.warn(
                "CCodeBlockAssignment: wrapper data missing, creating new"
            );
            data.wrapper = {
                type: "CCodeBlockWrapper",
                content: null,
                next: [],
            };
        }

        const wrapper = await CCodeBlockWrapper.deserialize(data.wrapper);

        const block = new CCodeBlockAssignment(wrapper, onDrop, onPickUp);

        // Восстановление ID
        block.id = data.id || uuidv4(); // Генерация ID если отсутствует

        // Защита от отсутствия nameToAssign
        if (data.nameToAssign !== undefined) {
            block.setAssignmentState(data.nameToAssign);
        }

        // Рекурсивно восстанавливаем цепочку
        if (data.next) {
            // Используем универсальный десериализатор
            block.next = await deserializeAnyBlock(data.next, onDrop, onPickUp);
            if (block.next) {
                block.next.prev = block;
                block.next.parent = block.parent; // Восстанавливаем связь
            }
        }

        // Обновление обработчиков
        block.wrapper.updateEventHandlers(
            block.insertCodeBlock.bind(block), // Исправлено имя метода
            block.onPickUp
        );

        return block;
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("Доабавление в Assignment");
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

    override render(props: { key: Key; rerender: DispatchWithoutAction }) {
        return (
            <CodeBlockAssignment
                key={this.id}
                rerender={props.rerender}
                onDrop={this.onDropHandler}
                onChange={this.setAssignmentState}
                name={this.nameToAssign || ""}
                onLayout={this.setPositions.bind(this)}
                wrapper={this.wrapper}
                onPickUp={this.onPickUp}></CodeBlockAssignment>
        );
    }

    execute(le: LexicalEnvironment, contextReturn?: Value): Value {
        if (!this.nameToAssign)
            throw new Error(
                "Ошибка при создании переменной. Не назначено имя переменной"
            );
        if (
            !/(([a-zA-Z][a-zA-Z0-9]*\[((0)|([1-9]\d*))\])|([a-zA-Z][a-zA-Z0-9]*))( *, *(([a-zA-Z][a-zA-Z0-9]*\[((0)|([1-9]\d*))\])|([a-zA-Z][a-zA-Z0-9]*)))*/.test(
                this.nameToAssign
            )
        )
            throw new Error(
                "Неправильное наименование переменных. Переменная должна начинаться с буквы, далее сожержать только буквы латинского алфавита и цифры. Допускается передача нескольих имен переменных через запятую. Для присвоения значения элементу массива неоходимо указать индекс в квадратных скобках без пробелов после имени переменной."
            );

        let valueToAssign = this.wrapper.execute(new LexicalEnvironment(le));

        if (valueToAssign.type === TypeVoid)
            throw new Error("Ошибка присваивания. Невозиожно присвоить Void.");

        this.nameToAssign.split(",").forEach((item) => {
            if (
                /(([a-zA-Z][a-zA-Z0-9]*\[((0)|([1-9]\d*))\]))/.test(
                    item.trim()
                ) &&
                !le.getValue(item.trim())
            )
                throw new Error(
                    "Невозможно присвоить значание неинициализированному массиву."
                );
            le.setValue(item.trim(), valueToAssign);
        });

        return new Value(TypeVoid, "");
    }
}

export default CCodeBlockAssignment;

