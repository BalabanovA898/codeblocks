import {
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";

import { Key, useState } from "react";

import CodeBlocksWrapper from "../classes/CodeBlocksWrapper";
import CodeBlock from "../classes/CodeBlock";
import CodeBlockFunction from "../classes/CodeBlockFunction";

interface Props {
    blocks: CodeBlocksWrapper;
}

function getRenderArray(current: CodeBlock) {
    let currentNode: CodeBlock = current;
    let res = [current.content.render];
    while (currentNode.next !== null) {
        currentNode = currentNode.next;
        res.push(currentNode.content.render);
    }
    return res;
}

const CodeblocksZone = ({ blocks }: Props) => {
    const { height } = useWindowDimensions();
    const [blocksFunction, setBlocksFunction] = useState<CodeBlockFunction>(
        blocks.codeBlocksFunction
    );
    const [treeRoot, setTreeRoot] = useState<CodeBlock>(
        blocksFunction.codeBlocks.root
    );
    const [currentNode, setCurrentNode] = useState<CodeBlock | null>(treeRoot);
    const [renderArray, setRenderArray] = useState<
        Array<(props: { key: Key }) => React.JSX.Element>
    >(currentNode ? getRenderArray(currentNode) : []);

    return (
        <View style={{ height: height - 105, ...styles.container }}>
            <ScrollView>
                {renderArray.map((item, index) => item({ key: index }))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ff00ff",
    },
});

export default CodeblocksZone;

