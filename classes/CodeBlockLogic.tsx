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
import { uuidv4 } from "../shared/functions";

export default class CCodeBlockLogic
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
                new CCodeBlockLogic(blockWrapperA, blockWrapperB, this.onDrop)
            );
        }
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("Добавление в Logic");
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
            <CodeBlockLogic
                key={uuidv4()}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.setPositions.bind(this)}
                wrapperLeft={this.wrapperLeft}
                wrapperRight={this.wrapperRight}
                operator={this.operator || ""}
                setValue={this.setOperator.bind(this)}
                rerender={props.rerender}
                onPickUp={this.onPickUp}></CodeBlockLogic>
        );
    }

    execute(le: LexicalEnvironment): Value {
        let leftOperand = this.wrapperLeft.execute(new LexicalEnvironment(le));
        let rightOperand = this.wrapperRight.execute(
            new LexicalEnvironment(le)
        );
        if (leftOperand.type === TypeVoid || rightOperand.type === TypeVoid)
            throw new Error(
                "Ошибка в логическом вырожении. Операнд не может быть типа Void."
            );
        if (!this.operator)
            throw new Error(
                "Ошибка в логичесокм выражении. Необходимо выбрать логическую операцию."
            );

        switch (this.operator) {
            case "=":
                return new Value(
                    TypeBool,
                    new TypeBool().convertFromOtherType(
                        new leftOperand.type().compareEqual(
                            leftOperand,
                            rightOperand
                        )
                    )
                );
            case "<":
                return new Value(
                    TypeBool,
                    new TypeBool().convertFromOtherType(
                        new leftOperand.type().compareLess(
                            leftOperand,
                            rightOperand
                        )
                    )
                );
            case ">":
                return new Value(
                    TypeBool,
                    new TypeBool().convertFromOtherType(
                        new leftOperand.type().compareBigger(
                            leftOperand,
                            rightOperand
                        )
                    )
                );
            case "&&":
                return new Value(
                    TypeBool,
                    new TypeBool().convertFromOtherType(leftOperand.value) &&
                        new TypeBool().convertFromOtherType(rightOperand.value)
                );
            case "||":
                return new Value(
                    TypeBool,
                    new TypeBool().convertFromOtherType(leftOperand.value) ||
                        new TypeBool().convertFromOtherType(rightOperand.value)
                );
            case "Xor":
                return new Value(
                    TypeBool,
                    new TypeBool().convertFromOtherType(leftOperand.value) <=
                        new TypeBool().convertFromOtherType(rightOperand.value)
                );
            default:
                throw new Error(
                    "Ошибка в логическом выражении. Произошла непредвиденная ошиюбка интерпритации."
                );
        }
    }
}

