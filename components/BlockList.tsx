import { Dispatch, DispatchWithoutAction, useReducer, useState } from "react";
import {
    StyleSheet,
    View,
    PanResponderGestureState,
    GestureResponderEvent,
    ScrollView,
    Dimensions,
} from "react-native";
import CCodeBlockAsigment from "../classes/CodeBlockAssignment";
import CCodeBlock from "../classes/Functional/CodeBlock";
import CCodeBlockPrint from "../classes/CodeBlockPrint";
import CCodeBlockWrapper from "../classes/CodeBlockWrapper";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import CCodeBlockValue from "../classes/CodeBlockValue";
import CCodeBlockGetVariableValue from "../classes/CodeBlockGetVariable";
import CCodeBlockLogic from "../classes/CodeBlockLogic";
import CCodeBlockMath from "../classes/CodeBlockMath";
import CCodeBlockIfStatement from "../classes/CodeBlockIfStatement";
import { uuidv4 } from "../shared/functions";
import CCodeBlockWhile from "../classes/CodeBlockWhile";
import Renderable from "../shared/Interfaces/Renderable";
import CCodeBlockBreak from "../classes/CodeBlockBreak";
import SelectBlock from "./SelectBlock";
import CCodeBlockLogicNot from "../classes/CodeBlockLogicNot";

interface Props {
    isVisible: Boolean;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) => void;
    globalOutput: string[];
    globalSetOutput: Dispatch<string[]>;
}

const BlockList = (props: Props) => {
    const flowControl: Renderable[] = [
        new CCodeBlockIfStatement(
            { x: 0, y: 0 },
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            props.onDrop
        ),
        new CCodeBlockWhile(
            { x: 0, y: 0 },
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            props.onDrop
        ),
        new CCodeBlockBreak({ x: 0, y: 0 }, props.onDrop),
    ];
    const utility = [
        new CCodeBlockAsigment(
            { x: 0, y: 0 },
            new CCodeBlockWrapper({ x: 0, y: 0 }, null),
            props.onDrop
        ),
        new CCodeBlockPrint(
            { x: 0, y: 0 },
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            props.onDrop,
            props.globalOutput,
            props.globalSetOutput
        ),
        new CCodeBlockValue({ x: 0, y: 0 }, props.onDrop),
        new CCodeBlockGetVariableValue({ x: 0, y: 0 }, props.onDrop),
    ];
    const operators = [
        new CCodeBlockLogic(
            { x: 0, y: 0 },
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            props.onDrop
        ),
        new CCodeBlockMath(
            { x: 0, y: 0 },
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            props.onDrop
        ),
        new CCodeBlockLogicNot(
            { x: 0, y: 0 },
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            props.onDrop
        ),
    ];
    const [isUtilityOpen, setIsUtilityOpen] = useState(false);
    const [isFlowControlOpen, setIsFlowControlOpen] = useState(false);
    const [isOperatorsOpen, setIsOperatorsOpen] = useState(false);
    const [, renderer] = useReducer((e) => e - 1, 0);
    return (
        <ScrollView
            style={{
                display: props.isVisible ? "flex" : "none",
                ...styles.container,
            }}>
            <SelectBlock
                blocks={utility}
                text="Утилитарные"
                isOpen={isUtilityOpen}
                setIsOpen={setIsUtilityOpen}
                rerender={renderer}
            />
            <SelectBlock
                blocks={flowControl}
                text="Контроль потока"
                isOpen={isFlowControlOpen}
                setIsOpen={setIsFlowControlOpen}
                rerender={renderer}
            />
            <SelectBlock
                blocks={operators}
                text="Операторы"
                isOpen={isOperatorsOpen}
                setIsOpen={setIsOperatorsOpen}
                rerender={renderer}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 0,
        top: Dimensions.get("window").height / 10,
        padding: 10,
        overflow: "visible",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        zIndex: 2,
    },
});

export default BlockList;

