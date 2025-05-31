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
import CodeBlockIfStatement from "../components/CodeBlockIfStatement";
import { uuidv4 } from "../shared/functions";

export default class CCodeBlockIfStatement
    extends CCodeBlock
    implements Returnable, Renderable, Droppable, ICodeBlock
{
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) => void;
    onPickUp?: () => void;
    wrapperIf: CCodeBlockWrapper;
    wrapperThen: CCodeBlockWrapper;
    wrapperElse: CCodeBlockWrapper;
    operator: string | null = null;

    constructor(
        wrapperA: CCodeBlockWrapper,
        wrapperB: CCodeBlockWrapper,
        wrapperC: CCodeBlockWrapper,
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
        this.onDrop = onDrop;
        this.onPickUp = onPickUp;
        this.wrapperIf = wrapperA;
        this.wrapperThen = wrapperB;
        this.wrapperElse = wrapperC;
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
            let blockWrapperC = new CCodeBlockWrapper(null, null);
            this.onDrop(
                e,
                g,
                new CCodeBlockIfStatement(
                    blockWrapperA,
                    blockWrapperB,
                    blockWrapperC,
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
        console.log("Добавление в IfStatement");
        if (this.checkDropIn(g)) {
            if (block.id === this.id) return true;
            if (this.wrapperIf.checkDropIn(g))
                return this.wrapperIf.insertCodeBlock(e, g, block);
            if (this.wrapperThen.checkDropIn(g))
                return this.wrapperThen.insertCodeBlock(e, g, block);
            if (this.wrapperElse.checkDropIn(g))
                return this.wrapperElse.insertCodeBlock(e, g, block);
            this.pushCodeBlockAfterThis(block);
            return true;
        }
        if (this.next) return this.next.insertCodeBlock(e, g, block);
        return false;
    }

    serialize() {
        return {
            type: "CCodeBlockIfStatement",
            id: this.id,
            operator: this.operator,
            wrapperIf: this.wrapperIf.serialize(),
            wrapperThen: this.wrapperThen.serialize(),
            wrapperElse: this.wrapperElse.serialize(),
            next: this.next ? this.next.serialize() : null,
        };
    }

    // Добавить статический метод десериализации
    static async deserialize(
        data: any,
        onDrop: any,
        onPickUp?: any
    ): Promise<CCodeBlockIfStatement> {
        const wrapperIf = await CCodeBlockWrapper.deserialize(data.wrapperIf);
        const wrapperThen = await CCodeBlockWrapper.deserialize(
            data.wrapperThen
        );
        const wrapperElse = await CCodeBlockWrapper.deserialize(
            data.wrapperElse
        );

        const block = new CCodeBlockIfStatement(
            wrapperIf,
            wrapperThen,
            wrapperElse,
            onDrop,
            onPickUp
        );
        block.id = data.id;
        block.operator = data.operator;

        if (data.next) {
            block.next = await this.deserialize(data.next, onDrop, onPickUp);
            if (block.next) {
                block.next.prev = block;
            }
        }

        return block;
    }

    setOperator(value: string): void {
        this.operator = value;
    }

    render(props: any): JSX.Element {
        return (
            <CodeBlockIfStatement
                key={uuidv4()}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.setPositions.bind(this)}
                wrapperIf={this.wrapperIf}
                wrapperThen={this.wrapperThen}
                wrapperElse={this.wrapperElse}
                rerender={props.rerender}
                onPickUp={this.onPickUp}></CodeBlockIfStatement>
        );
    }

    execute(le: LexicalEnvironment): Value {
        let statementResult = this.wrapperIf.execute(
            new LexicalEnvironment(le)
        );
        if (statementResult.type === TypeVoid)
            throw new Error(
                "Ошибка условного оператора. Тип Void не может испольоваться как условие."
            );
        if (new TypeBool().convertFromOtherType(statementResult.value))
            return this.wrapperThen.execute(new LexicalEnvironment(le));
        return this.wrapperElse.execute(new LexicalEnvironment(le));
    }
}

