import { DispatchWithoutAction, Key } from "react";
import {
    GestureResponderEvent,
    PanResponderGestureState,
    Animated,
} from "react-native";
import CodeBlockAssignment from "../components/CodeBlockAssignment";
import CCodeBlock from "./CodeBlock";
import Value from "./Functional/Value";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Returnable from "../shared/Interfaces/Returnable";
import TypeNumber from "./types/TypeNumber";
import { getTypeByString } from "../shared/functions";
import Renderable from "../shared/Interfaces/Renderable";
import Droppable from "../shared/Interfaces/Droppable";

interface ICodeBlockAssignment {
    isNew: boolean;
    nameToAssign: string | null;
    typeToAssign: string | null;
    valueToAssign: string | null;
}

interface Props {
    key: Key;
    type: string;
    name: string;
    value: string;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) => void;
    onChange: (name: string, value: string, type: string) => void;
    rerender: DispatchWithoutAction;
}

class CCodeBlockAssignment
    implements ICodeBlockAssignment, Renderable, Returnable, Droppable
{
    render_: (props: Props) => React.JSX.Element;
    isNew: boolean;
    parent: CCodeBlock | null;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;
    nameToAssign: string | null;
    valueToAssign: string | null;
    typeToAssign: string | null;

    constructor(
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: CCodeBlock
        ) => void,
        isNew: boolean,
        parent: CCodeBlock | null
    ) {
        this.render_ = CodeBlockAssignment;
        this.onDrop = onDrop;
        this.isNew = isNew;
        this.parent = parent;
        this.nameToAssign = null;
        this.valueToAssign = null;
        this.typeToAssign = null;
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
            this.parent.removeThisCodeBLock.call(this.parent);
            this.onDrop(e, g, this.parent);
        } else
            this.onDrop(
                e,
                g,
                new CCodeBlock(
                    { x: 0, y: 0 },
                    new CCodeBlockAssignment(this.onDrop, false, null),
                    null,
                    null,
                    null,
                    null,
                    null
                )
            );
    }

    setAssignmentState(name: string, value: string, type: string) {
        this.nameToAssign = name;
        this.valueToAssign = value;
        this.typeToAssign = type;
    }

    render(props: { key: Key; rerender: DispatchWithoutAction }) {
        return (
            <CodeBlockAssignment
                key={props.key}
                rerender={props.rerender}
                onDrop={this.onDropHandler.bind(this)}
                onChange={this.setAssignmentState.bind(this)}
                type={this.typeToAssign || ""}
                name={this.nameToAssign || ""}
                value={this.valueToAssign || ""}
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

