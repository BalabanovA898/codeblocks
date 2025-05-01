import { StyleSheet, View } from "react-native";

import Header from "./components/Header";
import FunctionNavigator from "./components/FunctionNavigator";
import CodeblocksZone from "./components/CodeblocksZone";
import Footer from "./components/Footer";
import BlockList from "./components/BlockList";

import { useState } from "react";
import CodeBlockFunction from "./classes/CodeBlockFunction";
import CodeBlock from "./classes/CodeBlock";
import CCodeBlockAsigment from "./classes/CodeBlockAsigment";

export default function App() {
    const [isBlockListVisible, setIsBlockListVisible] =
        useState<Boolean>(false);

    const [functionList, setFunctionList] = useState<Array<CodeBlockFunction>>([
        new CodeBlockFunction(
            new CodeBlock(
                new CCodeBlockAsigment(() => {}),
                null,
                new CodeBlock(new CCodeBlockAsigment(() => {}), null)
            )
        ),
    ]);

    const [currentFunction, setCurrentFunction] = useState<number>(0);
    const [currentCodeBlocks, setCurrecCodeBlocks] = useState<CodeBlock>(
        functionList[currentFunction].codeBlocks
    );

    return (
        <View>
            <Header
                isBlockListVisible={isBlockListVisible}
                setBlockListVisible={setIsBlockListVisible}
            />
            <BlockList isVisible={isBlockListVisible}></BlockList>
            <FunctionNavigator />
            <CodeblocksZone blocks={currentCodeBlocks} />
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({});

