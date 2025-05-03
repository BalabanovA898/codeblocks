import {
    GestureResponderEvent,
    PanResponderGestureState,
    StyleSheet,
    View,
} from "react-native";

import Header from "./components/Header";
import FunctionNavigator from "./components/FunctionNavigator";
import CodeblocksZone from "./components/CodeblocksZone";
import Footer from "./components/Footer";
import BlockList from "./components/BlockList";

import {
    createContext,
    Dispatch,
    useContext,
    useEffect,
    useState,
} from "react";
import CodeBlockFunction from "./classes/CodeBlockFunction";
import CCodeBlockWrapper from "./classes/CodeBlockWrapper";
import CCodeBlock from "./classes/CodeBlock";
import CCodeBlockAsigment from "./classes/CodeBlockAsigment";
import CodeBlockWrapper from "./components/CodeBlockWrapper";

export default function App() {
    const [isBlockListVisible, setIsBlockListVisible] =
        useState<Boolean>(false);
    const [codeBlocksZoneOffset, setCodeBlocksZoneOffset] = useState({
        x: 0,
        y: 0,
    });

    const [functions, setFunctions] = useState<CodeBlockFunction[]>([
        new CodeBlockFunction(
            new CCodeBlockWrapper(
                codeBlocksZoneOffset,
                new CCodeBlock(
                    codeBlocksZoneOffset,
                    new CCodeBlockAsigment(() => {}),
                    null,
                    null
                )
            )
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
                onDrop={functions[0].codeBlocks.insertCodeBlock.bind(
                    functions[0].codeBlocks
                )}
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

