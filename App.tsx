import { StyleSheet, View } from "react-native";

import Header from "./components/Header";
import FunctionNavigator from "./components/FunctionNavigator";
import CodeblocksZone from "./components/CodeblocksZone";
import Footer from "./components/Footer";
import BlockList from "./components/BlockList";

import { useEffect, useState } from "react";
import CodeBlocksWrapper from "./classes/CodeBlocksWrapper";
import CodeBlockFunction from "./classes/CodeBlockFunction";
import CodeBlocksTree from "./classes/CodeBlocksTree";
import CodeBlock from "./classes/CodeBlock";
import CCodeBlockAsigment from "./classes/CodeBlockAsigment";

export default function App() {
    const [isBlockListVisible, setIsBlockListVisible] =
        useState<Boolean>(false);

    const [functionList, setFunctionList] = useState<Array<CodeBlocksWrapper>>([
        new CodeBlocksWrapper(
            new CodeBlockFunction(
                new CodeBlocksTree(
                    new CodeBlock(
                        new CCodeBlockAsigment(),
                        new CodeBlock(
                            new CCodeBlockAsigment(),
                            new CodeBlock(
                                new CCodeBlockAsigment(),
                                new CodeBlock(
                                    new CCodeBlockAsigment(),
                                    new CodeBlock(
                                        new CCodeBlockAsigment(),
                                        null,
                                        null
                                    ),
                                    null
                                ),
                                null
                            ),
                            null
                        ),
                        null
                    )
                )
            )
        ),
    ]);

    const [currentFunction, setCurrentFunction] = useState(0);

    return (
        <View>
            <Header
                isBlockListVisible={isBlockListVisible}
                setBlockListVisible={setIsBlockListVisible}
            />
            <BlockList isVisible={isBlockListVisible}></BlockList>
            <FunctionNavigator />
            <CodeblocksZone blocks={functionList[currentFunction]} />
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({});

