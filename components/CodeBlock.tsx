import { Key, RefObject } from "react";
import { View, StyleSheet } from "react-native";
import { RenderContent } from "../types/types";
import CCodeBlockWrapper from "../classes/CodeBlockWrapper";

interface Props {
    key: Key;
    renderArray: Array<RenderContent | null>;
    children: CCodeBlockWrapper | null;
    onLayout: (x: number, y: number, w: number, h: number) => void;
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
            {props.renderArray.map((item) => {
                return item?.render.call(item, { key: Date.now() });
            })}
            {props.children?.render({ key: Date.now() })}
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
});

export default CodeBlock;

