import { DispatchWithoutAction, Key, RefObject, useReducer } from "react";
import { View, StyleSheet } from "react-native";
import CCodeBlockWrapper from "../classes/CodeBlockWrapper";
import Renderable from "../shared/Interfaces/Renderable";

interface Props {
    key: Key;
    renderItem: Renderable | null;
    children: CCodeBlockWrapper | null;
    onLayout: (x: number, y: number, w: number, h: number) => void;
    rerender: DispatchWithoutAction;
}

const CodeBlock = (props: Props) => {
    return (
        <View
            key={props.key}
            style={styles.container}
            onLayout={(e) => {
                props.onLayout(
                    e.nativeEvent.layout.x,
                    e.nativeEvent.layout.y,
                    e.nativeEvent.layout.width,
                    e.nativeEvent.layout.height
                );
            }}>
            <View style={styles.childrenBorder}>
                {props.children?.render({
                    key: Date.now(),
                    rerender: props.rerender,
                })}
            </View>
            <View style={styles.bodyBorder}>
                {props.renderItem?.render.call(props.renderItem, {
                    key: Date.now(),
                    rerender: props.rerender,
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0000ff",
        padding: 4,
        width: 300,
    },
    children: {
        backgroundColor: "orange",
        padding: 4,
    },
    childrenBorder: {
        borderColor: "white",
        borderWidth: 2,
    },
    bodyBorder: {
        borderColor: "red",
        borderWidth: 2,
    },
});

export default CodeBlock;

