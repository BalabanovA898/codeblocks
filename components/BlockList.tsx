import { Dispatch, DispatchWithoutAction, useReducer, useState } from "react";
import {
    StyleSheet,
    View,
    PanResponderGestureState,
    GestureResponderEvent,
} from "react-native";
import CCodeBlockAsigment from "../classes/CodeBlockAssignment";
import CCodeBlock from "../classes/CodeBlock";
import CCodeBlockPrint from "../classes/CodeBlockPrint";
import CCodeBlockWrapper from "../classes/CodeBlockWrapper";

interface Props {
    isVisible: Boolean;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;
    globalOutput: string[];
    globalSetOutput: Dispatch<string[]>;
}

const BlockList = (props: Props) => {
    const [codeBlocksAsigment, setCodeBlocksAsigment] = useState(
        new CCodeBlockAsigment(props.onDrop, true, null)
    );
    const [codeBlockPrint, setCodeBlockPrint] = useState(
        new CCodeBlockPrint(
            null,
            new CCodeBlockWrapper({ x: 0, y: 0 }, null, null),
            props.onDrop,
            props.globalOutput,
            props.globalSetOutput
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

