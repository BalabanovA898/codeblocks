import {
    Dispatch,
    DispatchWithoutAction,
    useReducer,
    useRef,
    useState,
} from "react";
import {
    StyleSheet,
    View,
    PanResponderGestureState,
    GestureResponderEvent,
    ScrollView,
    Dimensions,
    Animated,
} from "react-native";
import CCodeBlockAsigment from "../classes/CodeBlockAssignment";
import CCodeBlock from "../classes/Functional/CodeBlock";
import CCodeBlockPrint from "../classes/CodeBlockPrint";
import CCodeBlockWrapper from "../classes/CodeBlockWrapper";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import CCodeBlockValue from "../classes/CodeBlockValue";
import CCodeBlockGetVariableValue from "../classes/CodeBlockGetVariable";
import CCodeBlockLogic from "../classes/CodeBlockLogic";
import CCodeBlockMath from "../classes/CodeBlockMath";
import CCodeBlockIfStatement from "../classes/CodeBlockIfStatement";
import { uuidv4 } from "../shared/functions";
import CCodeBlockWhile from "../classes/CodeBlockWhile";
import Renderable from "../shared/Interfaces/Renderable";
import CCodeBlockBreak from "../classes/CodeBlockBreak";
import SelectBlock from "./SelectBlock";
import CCodeBlockLogicNot from "../classes/CodeBlockLogicNot";
import CCodeBlockArrayInit from "../classes/CodeBlockArrayInit";

interface Props {
    isVisible: Boolean;
    setIsVisible: Dispatch<Boolean>;
    onDrop: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) => void;
}

const BlockList = (props: Props) => {
    const onPickUp = () => {
        Animated.spring(windowOpacity, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
        console.log(windowOpacity);
    };

    const onDropHandler = (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) => {
        Animated.spring(windowOpacity, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
        props.onDrop(e, g, block);
    };

    let windowOpacity = useRef(new Animated.Value(1)).current;

    const opacity = windowOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 1],
    });

    const flowControl: Renderable[] = [
        new CCodeBlockIfStatement(
            new CCodeBlockWrapper(null, null),
            new CCodeBlockWrapper(null, null),
            new CCodeBlockWrapper(null, null),
            onDropHandler,
            onPickUp
        ),
        new CCodeBlockWhile(
            new CCodeBlockWrapper(null, null),
            new CCodeBlockWrapper(null, null),
            onDropHandler,
            onPickUp
        ),
        new CCodeBlockBreak(onDropHandler, onPickUp),
    ];
    const utility = [
        new CCodeBlockAsigment(
            new CCodeBlockWrapper(null),
            onDropHandler,
            onPickUp
        ),
        new CCodeBlockPrint(
            new CCodeBlockWrapper(null, null),
            onDropHandler,
            onPickUp
        ),
        new CCodeBlockValue(onDropHandler, onPickUp),
        new CCodeBlockArrayInit(onDropHandler, onPickUp),
        new CCodeBlockGetVariableValue(onDropHandler, onPickUp),
    ];
    const operators = [
        new CCodeBlockLogic(
            new CCodeBlockWrapper(null, null),
            new CCodeBlockWrapper(null, null),
            onDropHandler,
            onPickUp
        ),
        new CCodeBlockMath(
            new CCodeBlockWrapper(null, null),
            new CCodeBlockWrapper(null, null),
            onDropHandler,
            onPickUp
        ),
        new CCodeBlockLogicNot(
            new CCodeBlockWrapper(null, null),
            onDropHandler,
            onPickUp
        ),
    ];
    const [isUtilityOpen, setIsUtilityOpen] = useState(false);
    const [isFlowControlOpen, setIsFlowControlOpen] = useState(false);
    const [isOperatorsOpen, setIsOperatorsOpen] = useState(false);
    const [, renderer] = useReducer((e) => e - 1, 0);
    return (
        <Animated.View
            style={{
                display: props.isVisible ? "flex" : "none",
                ...styles.container,
                opacity: opacity,
            }}>
            <SelectBlock
                blocks={utility}
                text="Утилитарные"
                isOpen={isUtilityOpen}
                setIsOpen={setIsUtilityOpen}
                rerender={renderer}
            />
            <SelectBlock
                blocks={flowControl}
                text="Контроль потока"
                isOpen={isFlowControlOpen}
                setIsOpen={setIsFlowControlOpen}
                rerender={renderer}
            />
            <SelectBlock
                blocks={operators}
                text="Операторы"
                isOpen={isOperatorsOpen}
                setIsOpen={setIsOperatorsOpen}
                rerender={renderer}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 0,
        top: Dimensions.get("window").height / 10,
        padding: 10,
        overflow: "visible",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 2,
    },
});

export default BlockList;

