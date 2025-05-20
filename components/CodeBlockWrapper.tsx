import { DispatchWithoutAction, Key } from "react";
import { StyleSheet, View } from "react-native";
import CCodeBlock from "../classes/CodeBlock";

interface Props {
    key: Key;
    onLayout: (x: number, y: number, w: number, h: number) => void;
    firstElement: CCodeBlock | null;
    rerender: DispatchWithoutAction;
}

const CodeBlockWrapper = (props: Props) => {
    let renderArray = [];
    let currentNode = props.firstElement;
    while (currentNode) {
        renderArray.push(
            currentNode.renderSequence({
                key: Date.now() + renderArray.length,
                rerender: props.rerender,
            })
        );
        currentNode = currentNode.next;
    }
    return (
        <View
            style={styles.container}
            key={props.key}
            onLayout={(e) => {
                props.onLayout(
                    e.nativeEvent.layout.x,
                    e.nativeEvent.layout.y,
                    e.nativeEvent.layout.width,
                    e.nativeEvent.layout.height
                );
            }}>
            {renderArray}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "tomato",
        minHeight: 40,
        minWidth: 100,
    },
});

export default CodeBlockWrapper;

