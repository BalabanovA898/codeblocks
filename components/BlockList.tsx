import { useState } from "react";
import {
    StyleSheet,
    View,
    PanResponderGestureState,
    GestureResponderEvent,
} from "react-native";
import CCodeBlockAsigment from "../classes/CodeBlockAsigment";
import CCodeBlock from "../classes/CodeBlock";

interface Props {
    isVisible: Boolean;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;
}

const BlockList = (props: Props, index: Number) => {
    const [codeBlocksAsigment, setCodeBlocksAsigment] = useState(
        new CCodeBlockAsigment(props.onDrop)
    );

    return (
        <View
            style={{
                display: props.isVisible ? "flex" : "none",
                ...styles.container,
            }}>
            {codeBlocksAsigment.render.call(codeBlocksAsigment, {
                key: Date.now(),
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

