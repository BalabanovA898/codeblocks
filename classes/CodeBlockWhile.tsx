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
import CodeBlockWhile from "../components/CodeBlockWhile";

export default class CCodeBlockWhile
    extends CCodeBlock
    implements Returnable, Renderable, Droppable, ICodeBlock
{
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;
    wrapperWhile: CCodeBlockWrapper;
    wrapperDo: CCodeBlockWrapper;
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
        this.wrapperWhile = wrapperA;
        this.wrapperDo = wrapperB;
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
            let blockWrapperA = new CCodeBlockWrapper(this.offset, null, null);
            let blockWrapperB = new CCodeBlockWrapper(this.offset, null, null);
            this.onDrop(
                e,
                g,
                new CCodeBlockWhile(
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
        console.log("Добавление в IfStatement");
        if (this.checkDropIn(g)) {
            if (block.id === this.id) return true;
            if (this.wrapperWhile.checkDropIn(g))
                return this.wrapperWhile.insertCodeBlock(e, g, block);
            if (this.wrapperDo.checkDropIn(g))
                return this.wrapperDo.insertCodeBlock(e, g, block);
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
            <CodeBlockWhile
                key={uuidv4()}
                onDrop={this.onDropHandler.bind(this)}
                onLayout={this.setPositions.bind(this)}
                wrapperWhile={this.wrapperWhile}
                wrapperDo={this.wrapperDo}
                rerender={props.rerender}></CodeBlockWhile>
        );
    }

    execute(le: LexicalEnvironment): Value {
        let statement = this.wrapperWhile.execute(new LexicalEnvironment(le));
        if (statement.type === TypeVoid)
            throw new Error(
                "Ошибка цикла с услвовием. Тип Void не может использоваться в качестве условия."
            );
        let iteration = new Value(TypeVoid, "");
        while (new TypeBool().convertFromOtherType(statement.value)) {
            iteration = this.wrapperDo.execute(new LexicalEnvironment(le));
            if (iteration.type !== TypeVoid) break;
            statement = this.wrapperWhile.execute(new LexicalEnvironment(le));
            if (statement.type === TypeVoid)
                throw new Error(
                    "Ошибка цикла с услвовием. Тип Void не может использоваться в качестве условия."
                );
        }
        return iteration;
    }
}

