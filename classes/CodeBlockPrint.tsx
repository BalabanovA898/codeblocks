import {
    GestureResponderEvent,
    PanResponderGestureState,
    Animated,
    View,
    Text,
} from "react-native";
import CodeBlockPrint from "../components/CodeBlockPrrint";
import Droppable from "../shared/Interfaces/Droppable";
import Renderable from "../shared/Interfaces/Renderable";
import Returnable from "../shared/Interfaces/Returnable";
import CCodeBlock from "./CodeBlock";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Value from "./Functional/Value";
import TypeNumber from "./types/TypeNumber";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import { Dispatch, DispatchWithoutAction, Key } from "react";

interface ICodeBlockPrint {
    wrapper: CCodeBlockWrapper;
    globalSetOutput: Dispatch<string[]>;
    globalOutput: string[];
}

interface Props {
    key: Key;
    rerender: DispatchWithoutAction;
}

class CCodeBlockPrint
    implements Returnable, Renderable, Droppable, ICodeBlockPrint
{
    parent: CCodeBlock | null;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => void;
    wrapper: CCodeBlockWrapper;
    globalOutput: string[];
    globalSetOutput: Dispatch<string[]>;

    constructor(
        parent: CCodeBlock | null,
        wrapper: CCodeBlockWrapper,
        onDrop: (
            e: GestureResponderEvent,
            g: PanResponderGestureState,
            block: CCodeBlock
        ) => void,
        go: string[],
        gso: Dispatch<string[]>
    ) {
        this.parent = parent;
        this.onDrop = onDrop;
        this.wrapper = wrapper;
        this.wrapper.le = new LexicalEnvironment(
            this.parent ? this.parent.le : null
        );
        this.globalOutput = go;
        this.globalSetOutput = gso;
    }
    onDropHandler(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        position: Animated.ValueXY
    ) {
        Animated.spring(new Animated.ValueXY(position), {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();
        if (this.parent) {
            this.parent.removeThisCodeBLock.call(this.parent);
            this.onDrop(e, g, this.parent);
        } else {
            let blockWrapper = new CCodeBlockWrapper(
                { x: 0, y: 0 },
                null,
                null
            );
            this.onDrop(
                e,
                g,
                new CCodeBlock(
                    { x: 0, y: 0 },
                    new CCodeBlockPrint(
                        null,
                        blockWrapper,
                        this.onDrop,
                        this.globalOutput,
                        this.globalSetOutput
                    ),
                    null,
                    null,
                    blockWrapper,
                    null,
                    null
                )
            );
        }
    }
    render(props: Props): JSX.Element {
        return (
            <CodeBlockPrint
                key={Date.now()}
                onDrop={this.onDropHandler.bind(this)}>
                <View>
                    <Text>TEXT</Text>
                </View>
            </CodeBlockPrint>
        );
    }
    execute(le: LexicalEnvironment, contextReturn?: Value): Value {
        if (contextReturn?.value === undefined)
            throw new Error(
                "Ошибка при попытке напечатать значение. Возможно вы пытаетесть вывести VOID"
            );
        this.globalSetOutput([...this.globalOutput, contextReturn?.value]);
        console.log(this.globalOutput);
        return new Value(TypeNumber, "-1");
    }
}

export default CCodeBlockPrint;

