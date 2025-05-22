import { Dispatch, DispatchWithoutAction, useReducer, useState } from "react";
import {
    StyleSheet,
    View,
    PanResponderGestureState,
    GestureResponderEvent,
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
    const [codeBlocksAsigment, setCodeBlocksAsigment] = useState(
        new CCodeBlockAsigment(
            { x: 0, y: 0 },
            new CCodeBlockWrapper({ x: 0, y: 0 }, null),
            props.onDrop
        )
    );
    const [codeBlockPrint, setCodeBlockPrint] = useState(
        new CCodeBlockPrint(
            { x: 0, y: 0 },
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            props.onDrop,
            props.globalOutput,
            props.globalSetOutput
        )
    );
    const [codeBlockValue, setCodeBlockValue] = useState(
        new CCodeBlockValue({ x: 0, y: 0 }, props.onDrop)
    );

    const [codeBlockGetVariableValue, setCodeBlockGetVariableValue] = useState(
        new CCodeBlockGetVariableValue({ x: 0, y: 0 }, props.onDrop)
    );
    const [codeBlockLogic, setCodeBlockLogic] = useState(
        new CCodeBlockLogic(
            { x: 0, y: 0 },
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            props.onDrop
        )
    );
    const [codeBlockMath, setCodeBlockMath] = useState(
        new CCodeBlockMath(
            { x: 0, y: 0 },
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            props.onDrop
        )
    );
    const [, renderer] = useReducer((e) => e - 1, 0);
    return (
        <View
            style={{
                display: props.isVisible ? "flex" : "none",
                ...styles.container,
            }}>
            {codeBlocksAsigment.render.call(codeBlocksAsigment, {
                key: Date.now(),
                rerender: renderer,
            })}
            {codeBlockPrint.render.call(codeBlockPrint, {
                key: Date.now(),
                rerender: renderer,
            })}
            {codeBlockValue.render.call(codeBlockValue, {
                key: Date.now(),
                rerender: renderer,
            })}
            {codeBlockGetVariableValue.render.call(codeBlockGetVariableValue, {
                key: Date.now(),
                rerender: renderer,
            })}
            {codeBlockLogic.render.call(codeBlockLogic, {
                key: Date.now(),
                rerender: renderer,
            })}
            {codeBlockMath.render.call(codeBlockMath, {
                key: Date.now(),
                rerender: renderer,
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 0,
        top: 115,
        zIndex: 2,
        justifyContent: "center",
        alignItems: "flex-end",
        overflow: "visible",
    },
    scrollView: {},
});

export default BlockList;

