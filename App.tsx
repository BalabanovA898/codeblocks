import { SafeAreaView, View } from "react-native";

import Header from "./components/Header";
import FunctionNavigator from "./components/FunctionNavigator";
import CodeblocksZone from "./components/CodeblocksZone";
import Footer from "./components/Footer";
import BlockList from "./components/BlockList";

import { useEffect, useState } from "react";
import CodeBlockFunction from "./classes/CodeBlockFunction";
import CCodeBlockWrapper from "./classes/CodeBlockWrapper";
import LexicalEnvironment from "./classes/Functional/LexicalEnvironment";
import OutputWindow from "./components/OutoutWindow";
import TypeNumber from "./classes/types/TypeNumber";
import Menu from "./components/Menu";

export default function App() {
    const [isBlockListVisible, setIsBlockListVisible] =
        useState<Boolean>(false);
    const [isOutputWindowVisible, setIsOutputWindowVisible] =
        useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const [codeBlocksZoneOffset, setCodeBlocksZoneOffset] = useState({
        x: 0,
        y: 0,
    });

    const changeFunctionList = (fn: CodeBlockFunction) => {
        let res = [];
        for (let item = 0; item < functions.length; ++item)
            res.push(item != currentFunction ? functions[item] : fn);
        setFunctions(res);
    };

    let globalLE = new LexicalEnvironment(null);
    const [output, setOutput] = useState<string[]>([]);

    const [functions, setFunctions] = useState<CodeBlockFunction[]>([
        new CodeBlockFunction(
            new CCodeBlockWrapper(codeBlocksZoneOffset, null),
            changeFunctionList,
            TypeNumber,
            output,
            setOutput,
            "main"
        ),
    ]);
    const [currentFunction, setCurrentFunction] = useState<number>(0);
    const [countOfFunctions, setCountOfFunctions] = useState<number>(1);

    const [fileName, setFileName] = useState<string>("");

    useEffect(() => {
        let copy = functions;
        functions[0].codeBlocks.offset = {
            x: codeBlocksZoneOffset.x,
            y: codeBlocksZoneOffset.y,
        };
        setFunctions({ ...copy });
    }, [codeBlocksZoneOffset]);

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
                globalOutput={output}
                globalSetOutput={setOutput}></BlockList>
            <Menu isOpen={isMenuOpen}></Menu>
            <FunctionNavigator
                functions={functions}
                setCurrentFunction={setCurrentFunction}
                countOfFunctions={countOfFunctions}
            />
            <CodeblocksZone
                setCBZO={setCodeBlocksZoneOffset}
                blocks={functions[currentFunction].codeBlocks}
            />
            <Footer
                executeCode={() => {
                    setOutput([]);
                    try {
                        globalLE = new LexicalEnvironment(null);
                        functions[currentFunction].execute.bind(
                            functions[currentFunction]
                        )(globalLE);
                    } catch (e: any) {
                        setOutput([...output, e.message]);
                    }
                    setIsOutputWindowVisible(true);
                }}
            />
            <OutputWindow
                isActive={isOutputWindowVisible}
                setIsActive={setIsOutputWindowVisible}
                massages={output}></OutputWindow>
        </SafeAreaView>
    );
}

