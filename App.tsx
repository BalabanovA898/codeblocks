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
import CCodeBlockAssignment from "./classes/CodeBlockAsigment";

export default function App() {
    const [isBlockListVisible, setIsBlockListVisible] =
        useState<Boolean>(false);
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

    const [functions, setFunctions] = useState<CodeBlockFunction[]>([
        new CodeBlockFunction(
            new CCodeBlockWrapper(
                codeBlocksZoneOffset,
                new CCodeBlock(
                    codeBlocksZoneOffset,
                    new CCodeBlockAssignment(() => {}),
                    null,
                    null
                )
            ),
            changeFunctionList
        ),
    ]);
    const [currentFunction, setCurrentFunction] = useState<number>(0);

    useEffect(() => {
        console.log(codeBlocksZoneOffset);
        let copy = functions;
        functions[0].codeBlocks.offset = {
            x: codeBlocksZoneOffset.x + functions[0].codeBlocks.offset.x,
            y: codeBlocksZoneOffset.y + functions[0].codeBlocks.offset.y,
        };
        functions[0].codeBlocks.content.offset = {
            x:
                codeBlocksZoneOffset.x +
                functions[0].codeBlocks.content.offset.x,
            y:
                codeBlocksZoneOffset.y +
                functions[0].codeBlocks.content.offset.y,
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
                isVisible={isBlockListVisible}></BlockList>
            <FunctionNavigator />
            <CodeblocksZone
                setCBZO={setCodeBlocksZoneOffset}
                blocks={functions[currentFunction].codeBlocks}
            />
            <Footer />
        </View>
    );
}

