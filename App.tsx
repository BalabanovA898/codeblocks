import { View } from "react-native";

import Header from "./components/Header";
import FunctionNavigator from "./components/FunctionNavigator";
import CodeblocksZone from "./components/CodeblocksZone";
import Footer from "./components/Footer";
import BlockList from "./components/BlockList";

import { useEffect, useState } from "react";
import CodeBlockFunction from "./classes/CodeBlockFunction";
import CCodeBlockWrapper from "./classes/CodeBlockWrapper";
import CCodeBlock from "./classes/CodeBlock";
import LexicalEnvironment from "./classes/Functional/LexicalEnvironment";
import OutputWindow from "./components/OutoutWindow";
import CCodeBlockAssignment from "./classes/CodeBlockAssignment";
import TypeNumber from "./classes/types/TypeNumber";

export default function App() {
    const [isBlockListVisible, setIsBlockListVisible] =
        useState<Boolean>(false);
    const [isOutputWindowVisible, setIsOutputWindowVisible] =
        useState<boolean>(false);
    const [codeBlocksZoneOffset, setCodeBlocksZoneOffset] = useState({
        x: 0,
        y: 0,
    });

    const changeFunctionList = (fn: CodeBlockFunction) => {
        let res = [];
        for (let item = 0; item < functions.length; ++item)
            res.push(item != currentFunction ? functions[item] : fn);
        setFunctions(res);
        console.log("Hello form cfl");
    };

    let globalLE = new LexicalEnvironment(null);

    const [functions, setFunctions] = useState<CodeBlockFunction[]>([
        new CodeBlockFunction(
            new CCodeBlockWrapper(codeBlocksZoneOffset, null, globalLE),
            changeFunctionList,
            TypeNumber,
            globalLE
        ),
    ]);
    const [currentFunction, setCurrentFunction] = useState<number>(0);

    const [output, setOutput] = useState<string[]>([]);

    useEffect(() => {
        console.log(codeBlocksZoneOffset);
        let copy = functions;
        functions[0].codeBlocks.offset = {
            x: codeBlocksZoneOffset.x + functions[0].codeBlocks.offset.x,
            y: codeBlocksZoneOffset.y + functions[0].codeBlocks.offset.y,
        };
        setFunctions({ ...copy });
        console.log(functions);
    }, [codeBlocksZoneOffset]);

    return (
        <View>
            <Header
                isBlockListVisible={isBlockListVisible}
                setBlockListVisible={setIsBlockListVisible}
            />
            <BlockList
                onDrop={functions[0].insertNewCodeBlock.bind(functions[0])}
                isVisible={isBlockListVisible}
                globalOutput={output}
                globalSetOutput={setOutput}></BlockList>
            <FunctionNavigator />
            <CodeblocksZone
                setCBZO={setCodeBlocksZoneOffset}
                blocks={functions[currentFunction].codeBlocks}
            />
            <Footer
                executeCode={() => {
                    globalLE = new LexicalEnvironment(null);
                    functions[currentFunction].execute.bind(
                        functions[currentFunction]
                    )();
                    setIsOutputWindowVisible(true);
                }}
            />
            <OutputWindow
                isActive={isOutputWindowVisible}
                setIsActive={setIsOutputWindowVisible}
                massages={output}></OutputWindow>
        </View>
    );
}

