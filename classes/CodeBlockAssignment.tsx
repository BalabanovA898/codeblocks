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
import { convertFrom, getTypeByString } from "../shared/functions";
import Renderable from "../shared/Interfaces/Renderable";
import Droppable from "../shared/Interfaces/Droppable";
import { Position } from "../shared/types";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import TypeVoid from "./types/TypeVoid";

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

    constructor(
        offset: Position,
        wrapper: CCodeBlockWrapper,
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: ICodeBlock
        ) => void,
        next: CCodeBlock | null = null,
        prev: CCodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(offset, next, prev, parent);
        this.render_ = CodeBlockAssignment;
        this.onDrop = onDrop;
        this.nameToAssign = null;
        this.wrapper = wrapper;
    }

    onDropHandler(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) {
        if (this.parent) {
            this.removeThisCodeBLock();
            this.onDrop(e, g, this);
        } else {
            let blockWrapper = new CCodeBlockWrapper(this.offset, null, null);
            this.onDrop(
                e,
                g,
                new CCodeBlockAssignment(
                    { x: 0, y: 0 },
                    blockWrapper,
                    this.onDrop,
                    null
                )
            );
        }
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("1231231231");
        if (this.checkDropIn.call(this, g)) {
            if (this.wrapper.checkDropIn(g)) {
                this.wrapper.content = null;
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

    onLayoutHandler(x: number, y: number, w: number, h: number): void {
        this.setPositions(x, y, w, h, 0, 0);
        this.wrapper.offset = {
            x: this.elementX || 0 + this.offset.x,
            y: this.offset.y,
        };
        if (this.next)
            this.next.offset = {
                x: this.offset.x,
                y: this.offset.y + (this.elementHeight || 0),
            };
    }

    override render(props: { key: Key; rerender: DispatchWithoutAction }) {
        return (
            <CodeBlockAssignment
                key={props.key}
                rerender={props.rerender}
                onDrop={this.onDropHandler.bind(this)}
                onChange={this.setAssignmentState.bind(this)}
                name={this.nameToAssign || ""}
                onLayout={this.onLayoutHandler.bind(this)}
                wrapper={this.wrapper}></CodeBlockAssignment>
        );
    }
    execute(le: LexicalEnvironment, contextReturn?: Value): Value {
        if (!this.nameToAssign)
            throw new Error(
                "Ошибка при создании переменной. Не назначено имя переменной"
            );
        if (
            !/^ *[a-zA-Z][a-zA-Z0-9]* *( *, *[a-zA-Z][a-zA-Z0-9]* *)*\b/.test(
                this.nameToAssign
            )
        )
            throw new Error(
                "Неправильное наименование переменных. Переменная должна начинаться с буквы, далее сожержать только буквы латинского алфавита и цифры. Допускается передача нескольих имен переменных через запятую."
            );

        let valueToAssign = this.wrapper.execute(new LexicalEnvironment(le));

        if (valueToAssign.type === TypeVoid)
            throw new Error("Ошибка присваивания. Невозиожно присвоить Void.");

        this.nameToAssign.split(",").forEach((item) => {
            le.setValue(item.trim(), valueToAssign);
        });

        console.log(le);
        return new Value(TypeVoid, "");
    }
}

export default CCodeBlockAssignment;

