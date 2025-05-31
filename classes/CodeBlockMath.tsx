import {
    Animated,
    GestureResponderEvent,
    PanResponderGestureState,
} from "react-native";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import Droppable from "../shared/Interfaces/Droppable";
import Renderable from "../shared/Interfaces/Renderable";
import Returnable from "../shared/Interfaces/Returnable";
import CCodeBlock from "./Functional/CodeBlock";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import { Dispatch } from "react";
import { Position } from "../shared/types";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Value from "./Functional/Value";
import TypeVoid from "./types/TypeVoid";
import CodeBlockLogic from "../components/CodeBlockLogic";
import TypeNumber from "./types/TypeNumber";
import TypeBool from "./types/TypeBool";
import CodeBlockMath from "../components/CodeBlockMath";
import { uuidv4 } from "../shared/functions";

export default class CCodeBlockMath
    extends CCodeBlock
    implements Returnable, Renderable, Droppable, ICodeBlock
{
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;
    wrapperLeft: CCodeBlockWrapper;
    wrapperRight: CCodeBlockWrapper;
    operator: string | null = null;
    onPickUp?: () => void;

    constructor(
        wrapperA: CCodeBlockWrapper,
        wrapperB: CCodeBlockWrapper,
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: CCodeBlock
        ) => void,
        onPickUp?: () => void,
        next: CCodeBlock | null = null,
        prev: CCodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(next, prev, parent);
        this.onDrop = onDrop;
        this.wrapperLeft = wrapperA;
        this.wrapperRight = wrapperB;
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
            let blockWrapperA = new CCodeBlockWrapper(null, null);
            let blockWrapperB = new CCodeBlockWrapper(null, null);
            this.onDrop(
                e,
                g,
                new CCodeBlockMath(blockWrapperA, blockWrapperB, this.onDrop)
            );
        }
    }
    serialize() {
        return {
            type: "CCodeBlockMath",
            id: this.id,
            operator: this.operator,
            wrapperLeft: this.wrapperLeft.serialize(),
            wrapperRight: this.wrapperRight.serialize(),
            next: this.next ? this.next.serialize() : null,
        };
    }

    // Добавить статический метод десериализации
    static async deserialize(data: any, onDrop: any, onPickUp?: any): Promise<CCodeBlockMath> {
        const wrapperLeft = await CCodeBlockWrapper.deserialize(data.wrapperLeft);
        const wrapperRight = await CCodeBlockWrapper.deserialize(data.wrapperRight);
        
        const block = new CCodeBlockMath(
            wrapperLeft,
            wrapperRight,
            onDrop,
            onPickUp
        );
        block.id = data.id;
        block.operator = data.operator;
        
        // Рекурсивно восстанавливаем цепочку
        if (data.next) {
            block.next = await this.deserialize(data.next, onDrop, onPickUp);
            if (block.next) {
                block.next.prev = block;
            }
        }
        
        return block;
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("Добавлоение в Math");
        if (this.checkDropIn(g)) {
            if (block.id === this.id) return true;
            if (this.wrapperLeft.checkDropIn(g)) {
                return this.wrapperLeft.insertCodeBlock(e, g, block);
            }
            if (this.wrapperRight.checkDropIn(g)) {
                return this.wrapperRight.insertCodeBlock(e, g, block);
            }
            this.pushCodeBlockAfterThis(block);
            return true;
        }
        if (this.next) return this.next.insertCodeBlock(e, g, block);
        return false;
    }

    setOperator(value: string): void {
        this.operator = value;
    }

    render(props: any): JSX.Element {
        return (
            <CodeBlockMath
                key={uuidv4()}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.setPositions.bind(this)}
                wrapperLeft={this.wrapperLeft}
                wrapperRight={this.wrapperRight}
                operator={this.operator || ""}
                setValue={this.setOperator.bind(this)}
                rerender={props.rerender}
                onPickUp={this.onPickUp}></CodeBlockMath>
        );
    }

    execute(le: LexicalEnvironment): Value {
        let leftOperand = this.wrapperLeft.execute(new LexicalEnvironment(le));
        let rightOperand = this.wrapperRight.execute(
            new LexicalEnvironment(le)
        );
        if (leftOperand.type === TypeVoid || rightOperand.type === TypeVoid)
            throw new Error(
                "Ошибка в математическом вырожении. Операнд не может быть типа Void."
            );
        if (!this.operator)
            throw new Error(
                "Ошибка в математическом выражении. Необходимо выбрать логическую операцию."
            );

        let a = Number(
            new TypeNumber().convertFromOtherType(leftOperand.value)
        );
        let b = Number(
            new TypeNumber().convertFromOtherType(rightOperand.value)
        );

        switch (this.operator) {
            case "+":
                return new Value(TypeNumber, a + b);
            case "-":
                return new Value(TypeNumber, a - b);
            case "/":
                return new Value(TypeNumber, a / b);
            case "*":
                return new Value(TypeNumber, a * b);
            case "pow":
                return new Value(TypeNumber, Math.pow(a, b));
            case "mod":
                return new Value(TypeNumber, a % b);
            default:
                throw new Error(
                    "Ошибка в математическом выражении. Произошла непредвиденная ошиюбка инрепритации."
                );
        }
    }
}

