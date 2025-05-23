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

    constructor(
        offset: Position,
        wrapperA: CCodeBlockWrapper,
        wrapperB: CCodeBlockWrapper,
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: CCodeBlock
        ) => void,
        next: CCodeBlock | null = null,
        prev: CCodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(offset, next, prev, parent);
        this.onDrop = onDrop;
        this.wrapperLeft = wrapperA;
        this.wrapperRight = wrapperB;
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
            let blockWrapperA = new CCodeBlockWrapper(this.offset, null, null);
            let blockWrapperB = new CCodeBlockWrapper(this.offset, null, null);
            this.onDrop(
                e,
                g,
                new CCodeBlockMath(
                    { x: 0, y: 0 },
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
        if (this.checkDropIn(g)) {
            console.log("Insert inside the the print code block");
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

    onLayoutHandler(x: number, y: number, w: number, h: number): void {
        this.setPositions(x, y, w, h, 0, 0);
        this.wrapperLeft.offset = {
            x: this.elementX || 0 + this.offset.x,
            y: this.offset.y,
        };
        this.wrapperRight.offset = {
            x: this.elementX || 0 + this.offset.x,
            y: this.offset.y,
        };
        if (this.next)
            this.next.offset = {
                x: this.offset.x,
                y: this.offset.y + (this.elementHeight || 0),
            };
    }

    setOperator(value: string): void {
        this.operator = value;
    }

    render(props: any): JSX.Element {
        return (
            <CodeBlockMath
                key={Date.now()}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.onLayoutHandler.bind(this)}
                wrapperLeft={this.wrapperLeft}
                wrapperRight={this.wrapperRight}
                operator={this.operator || ""}
                setValue={this.setOperator.bind(this)}
                rerender={props.rerender}></CodeBlockMath>
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

        console.log("Operands", a, b);

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

