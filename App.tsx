import { Dimensions, SafeAreaView, View } from "react-native";

import Header from "./components/Header";
import FunctionNavigator from "./components/FunctionNavigator";
import CodeblocksZone from "./components/CodeblocksZone";
import Footer from "./components/Footer";
import BlockList from "./components/BlockList";

import { useEffect, useReducer, useState } from "react";
import CodeBlockFunction from "./classes/CodeBlockFunction";
import CCodeBlockWrapper from "./classes/CodeBlockWrapper";
import LexicalEnvironment from "./classes/Functional/LexicalEnvironment";
import OutputWindow from "./components/OutoutWindow";
import TypeNumber from "./classes/types/TypeNumber";
import Menu from "./components/Menu";
import Debug from "./components/Debug";
import ICodeBlock from "./shared/Interfaces/CodeBlock";
import { useSharedValue } from "react-native-reanimated";
import { output } from "./shared/globals";

export default function App() {
    const [isBlockListVisible, setIsBlockListVisible] =
        useState<Boolean>(false);
    const [isOutputWindowVisible, setIsOutputWindowVisible] =
        useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDebugMode, setIsDebugMode] = useState<boolean>(false);

    const changeFunctionList = (fn: CodeBlockFunction) => {
        let res = [];
        for (let item = 0; item < functions.length; ++item)
            res.push(item != currentFunction ? functions[item] : fn);
        setFunctions(res);
    };

    const clearOutput = () => {
        while (output.pop()) {}
    };

    let globalLE = new LexicalEnvironment(null);

    const [functions, setFunctions] = useState<CodeBlockFunction[]>([
        new CodeBlockFunction(
            new CCodeBlockWrapper(null),
            changeFunctionList,
            TypeNumber,
            "main"
        ),
    ]);
    const [currentFunction, setCurrentFunction] = useState<number>(0);
    const [countOfFunctions, setCountOfFunctions] = useState<number>(1);
    const [fileName, setFileName] = useState<string>("");
    const [debugBlock, setDebugBlock] = useState<ICodeBlock | null>(null);

    useEffect(() => {
        console.log("output: ", output);
    }, [output]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header
                isBlockListVisible={isBlockListVisible}
                setBlockListVisible={setIsBlockListVisible}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                fileName={fileName}
            />
            <BlockList
                onDrop={functions[0].insertNewCodeBlock.bind(functions[0])}
                isVisible={isBlockListVisible}
                setIsVisible={setIsBlockListVisible}
            />
            <Menu isOpen={isMenuOpen}></Menu>
            <FunctionNavigator
                functions={functions}
                setCurrentFunction={setCurrentFunction}
                countOfFunctions={countOfFunctions}
            />
            <CodeblocksZone blocks={functions[currentFunction].codeBlocks} />
            {!isDebugMode ? (
                <Footer
                    executeCode={() => {
                        try {
                            clearOutput();
                            output.push(
                                `Выполенение ${fileName} ${new Date(
                                    Date.now()
                                ).toString()}`
                            );
                            globalLE = new LexicalEnvironment(null);
                            functions[currentFunction].execute.bind(
                                functions[currentFunction]
                            )(globalLE);
                        } catch (e: any) {}
                        setIsOutputWindowVisible(true);
                    }}
                    setIsDebugMode={setIsDebugMode}
                />
            ) : (
                <Debug
                    nextStep={() => {
                        if (!debugBlock) {
                            clearOutput();
                            setDebugBlock(
                                functions[currentFunction].codeBlocks.content
                            );
                            globalLE = new LexicalEnvironment(null);
                            output.push("Начало сессии отладки.");
                        } else {
                            try {
                                debugBlock.execute(globalLE);
                                setDebugBlock(debugBlock.next);
                                if (!debugBlock)
                                    output.push(
                                        "Программа завершила своё выполнение."
                                    );
                            } catch (e: any) {
                                setDebugBlock(null);
                            }
                        }
                        setIsOutputWindowVisible(true);
                    }}
                    setIsDebugMode={setIsDebugMode}
                    setDebugBlock={setDebugBlock}
                />
            )}
            <OutputWindow
                isActive={isOutputWindowVisible}
                setIsActive={setIsOutputWindowVisible}
                massages={output}></OutputWindow>
        </SafeAreaView>
    );
}

