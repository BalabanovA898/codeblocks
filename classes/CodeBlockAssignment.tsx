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
import { getTypeByString } from "../shared/functions";
import Renderable from "../shared/Interfaces/Renderable";
import Droppable from "../shared/Interfaces/Droppable";
import { Position } from "../shared/types";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import ICodeBlock from "../shared/Interfaces/CodeBlock";

interface ICodeBlockAssignment {
    nameToAssign: string | null;
    typeToAssign: string | null;
    valueToAssign: string | null;
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
    valueToAssign: string | null;
    typeToAssign: string | null;

    constructor(
        offset: Position,
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: ICodeBlock
        ) => void,
        next: CCodeBlock | null = null,
        prev: CCodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null,
        le: LexicalEnvironment | null = null
    ) {
        super(offset, next, prev, parent);
        this.render_ = CodeBlockAssignment;
        this.onDrop = onDrop;
        this.nameToAssign = null;
        this.valueToAssign = null;
        this.typeToAssign = null;
    }

    onDropHandler(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) {
        if (this.parent) {
            this.removeThisCodeBLock();
            this.onDrop(e, g, this);
        } else
            this.onDrop(
                e,
                g,
                new CCodeBlockAssignment({ x: 0, y: 0 }, this.onDrop, null)
            );
    }

    override insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        console.log("1231231231");
        if (this.checkDropIn.call(this, g)) {
            this.pushCodeBlockAfterThis(block);
            return true;
        }
        if (this.next) {
            return this.next.insertCodeBlock(e, g, block);
        }
        return false;
    }

    setAssignmentState(name: string, value: string, type: string) {
        this.nameToAssign = name;
        this.valueToAssign = value;
        this.typeToAssign = type;
    }

    onLayoutHandler(x: number, y: number, w: number, h: number): void {
        this.setPositions(
            x,
            y,
            w,
            h,
            0,
            (this.prev?.offset.y || 0) + (this.prev?.elementY || 0)
        );
    }

    override render(props: { key: Key; rerender: DispatchWithoutAction }) {
        return (
            <CodeBlockAssignment
                key={props.key}
                rerender={props.rerender}
                onDrop={this.onDropHandler.bind(this)}
                onChange={this.setAssignmentState.bind(this)}
                type={this.typeToAssign || ""}
                name={this.nameToAssign || ""}
                value={this.valueToAssign || ""}
                onLayout={this.onLayoutHandler.bind(this)}
            />
        );
    }
    execute(le: LexicalEnvironment, contextReturn?: Value): Value {
        if (this.nameToAssign && this.typeToAssign && this.valueToAssign) {
            le.setValue(
                this.nameToAssign,
                new Value(
                    getTypeByString(this.typeToAssign),
                    this.valueToAssign
                )
            );
            console.log(le);
        }
        return new Value(TypeNumber, "-1");
    }
}

export default CCodeBlockAssignment;

