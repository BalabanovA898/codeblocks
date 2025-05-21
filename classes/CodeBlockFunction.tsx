import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import CCodeBlock from "./Functional/CodeBlock";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Returnable from "../shared/Interfaces/Returnable";
import Value from "./Functional/Value";
import { Class, InterpreterTypes } from "../shared/types";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import { Dispatch } from "react";
import TypeNumber from "./types/TypeNumber";

interface ICodeBlockFunction {
    codeBlocksWrapper_: CCodeBlockWrapper;
    cfl: (fn: CodeBlockFunction) => void;
    returnType: Class<InterpreterTypes>;
    le: LexicalEnvironment;
    output: string[];
    setOutput: Dispatch<string[]>;
    name: string;
}

class CodeBlockFunction implements ICodeBlockFunction, Returnable {
    codeBlocksWrapper_: CCodeBlockWrapper;
    cfl: (fn: CodeBlockFunction) => void;
    returnType: Class<InterpreterTypes>;
    le: LexicalEnvironment;
    output: string[];
    setOutput: Dispatch<string[]>;
    name: string;

    constructor(
        codeBlocksTree: CCodeBlockWrapper,
        changeFunctionList: (fn: CodeBlockFunction) => void,
        returnType: Class<InterpreterTypes>,
        le: LexicalEnvironment,
        output: string[],
        setOutput: Dispatch<string[]>,
        name: string
    ) {
        this.codeBlocksWrapper_ = codeBlocksTree;
        this.cfl = changeFunctionList;
        this.returnType = returnType;
        this.le = le;
        this.output = output;
        this.setOutput = setOutput;
        this.name = name;
    }

    set codeBlocks(newCodeBlocks: CCodeBlockWrapper) {
        this.codeBlocksWrapper_ = newCodeBlocks;
    }
    get codeBlocks() {
        return this.codeBlocksWrapper_;
    }

    insertNewCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) {
        this.codeBlocks.insertCodeBlock(e, g, block);
        this.cfl(this);
    }

    execute(): Value {
        this.le = new LexicalEnvironment(this.le.prev);
        try {
            return this.codeBlocks.execute();
        } catch (e: any) {
            this.setOutput([
                ...this.output,
                `Произошла  ошибка в фукнцие ${this.name}. Текст ошибки: ${e.message}`,
            ]);
            throw new Error(`Ошибка в функцие ${this.name}`);
        }
    }
}

export default CodeBlockFunction;

