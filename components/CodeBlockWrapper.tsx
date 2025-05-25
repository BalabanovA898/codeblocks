import { DispatchWithoutAction, Key, useReducer } from "react";
import { StyleSheet, View } from "react-native";
import CCodeBlock from "../classes/Functional/CodeBlock";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import { uuidv4 } from "../shared/functions";

interface Props {
    key: Key;
    onLayout: (x: number, y: number, w: number, h: number) => void;
    firstElement: ICodeBlock | null;
}

const CodeBlockWrapper = (props: Props) => {
    let renderArray = [];
    let currentNode = props.firstElement;
    const [, rerender] = useReducer((e) => e - 1, 0);
    while (currentNode) {
        renderArray.push(
            currentNode.render({
                key: uuidv4() + renderArray.length,
                rerender: rerender,
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

