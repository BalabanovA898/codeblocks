import { DispatchWithoutAction, Key, useReducer } from "react";
import { StyleSheet, View } from "react-native";
import CCodeBlock from "../classes/Functional/CodeBlock";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import { uuidv4 } from "../shared/functions";
import Draggable from "./Draggable";
import { processColorsInProps } from "react-native-reanimated/lib/typescript/Colors";

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
        console.log(currentNode);
        renderArray.push(
            currentNode.render({
                key: uuidv4() + renderArray.length,
                rerender: rerender,
            })
        );
        currentNode = currentNode.next;
    }

    let element: View | null;

    return (
        <View
            style={{
                ...styles.container,
                width: renderArray.length
                    ? props.firstElement?.elementWidth
                    : 250,
            }}
            key={props.key}
            ref={(view) => (element = view)}
            onLayout={(e) => {
                element?.measure((x, y, w, h, px, py) => {
                    props.onLayout(px, py, w, h);
                });
            }}>
            {renderArray.length ? (
                renderArray
            ) : (
                <Draggable
                    onDrop={() => {}}
                    styles={{
                        backgroundColor: "white",
                        width: 200,
                        height: 40,
                    }}></Draggable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
});

export default CodeBlockWrapper;

