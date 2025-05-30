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
import TypeBool from "./types/TypeBool";
import TypeString from "./types/TypeString";
import TypeVoid from "./types/TypeVoid";

interface ICodeBlockFunction {
    codeBlocks_: CCodeBlockWrapper;
    cfl: (fn: CodeBlockFunction) => void;
    returnType: Class<InterpreterTypes>;
    output?: string[];
    setOutput?: Dispatch<string[]>;
    name: string;
}

class CodeBlockFunction implements ICodeBlockFunction, Returnable {
    codeBlocks_: CCodeBlockWrapper;
    cfl: (fn: CodeBlockFunction) => void;
    returnType: Class<InterpreterTypes>;
    output?: string[];
    setOutput?: Dispatch<string[]>;
    name: string;

    constructor(
        codeBlocksTree: CCodeBlockWrapper,
        changeFunctionList: (fn: CodeBlockFunction) => void,
        returnType: Class<InterpreterTypes>,
        output?: string[],
        setOutput?: Dispatch<string[]>,
        name?: string
    ) {
        this.codeBlocks_ = codeBlocksTree;
        this.cfl = changeFunctionList;
        this.returnType = returnType;
        this.output = output;
        this.setOutput = setOutput;
        this.name = name || "Unnamed";
    }

    set codeBlocks(newCodeBlocks: CCodeBlockWrapper) {
        this.codeBlocks_ = newCodeBlocks;
    }

    get codeBlocks() {
        return this.codeBlocks_;
    }

    insertNewCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) {
        this.codeBlocks.insertCodeBlock(e, g, block);
        this.cfl(this);
    }

    execute(le: LexicalEnvironment): Value {
        try {
            return this.codeBlocks.execute(new LexicalEnvironment(le));
        } catch (e: any) {
            if (this.output && this.setOutput) {
                this.setOutput([
                    ...(this.output || []),
                    `Произошла ошибка в функции ${this.name}. Текст ошибки: ${e.message}`,
                ]);
            }
            throw new Error(
                `Произошла ошибка в функции ${this.name}. Текст ошибки: ${e.message}`
            );
        }
    }

    // ================== Новые функции ==================

    serialize() {
        return {
            name: this.name,
            returnType: this.returnType.name,
            codeBlocks: this.codeBlocks_.serialize(),
        };
    }

    static async deserialize(
        data: any,
        changeFunctionList: (fn: CodeBlockFunction) => void,
        output: string[] = [],
        setOutput: (output: string[]) => void
    ): Promise<CodeBlockFunction> {
        const typeMap: Record<string, Class<InterpreterTypes>> = {
            'TypeNumber': TypeNumber,
            'TypeBool': TypeBool,
            'TypeString': TypeString,
            'TypeVoid': TypeVoid,
        };

        const returnType = typeMap[data.returnType] || TypeVoid;

        if (!data.codeBlocks) {
            console.warn("Missing codeBlocks, creating default");
            data.codeBlocks = { type: "CCodeBlockWrapper", content: null };
        }

        const codeBlocks = await CCodeBlockWrapper.deserialize(data.codeBlocks);

        const fn = new CodeBlockFunction(
            codeBlocks,
            changeFunctionList,
            returnType,
            output,
            setOutput,
            data.name || "Unnamed"
        );

        // Обновляем обработчики
        fn.codeBlocks.updateEventHandlers(
            (e: any, g: any, block: ICodeBlock) => fn.insertNewCodeBlock(e, g, block),
            undefined
        );

        return fn;
    }

    updateEventHandlers() {
        this.codeBlocks.updateEventHandlers(
            (e: any, g: any, block: ICodeBlock) => this.insertNewCodeBlock(e, g, block),
            undefined
        );
    }
}

export default CodeBlockFunction;
