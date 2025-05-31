import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import CCodeBlockWrapper from "./CodeBlockWrapper";
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
import { output } from "../shared/globals";

class CodeBlockFunction implements Returnable {
    codeBlocksWrapper_: CCodeBlockWrapper;
    cfl: (fn: CodeBlockFunction) => void;
    returnType: Class<InterpreterTypes>;
    name: string;

    constructor(
        codeBlocksTree: CCodeBlockWrapper,
        changeFunctionList: (fn: CodeBlockFunction) => void,
        returnType: Class<InterpreterTypes>,
        name: string
    ) {
        this.codeBlocksWrapper_ = codeBlocksTree;
        this.cfl = changeFunctionList;
        this.returnType = returnType;
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

    execute(le: LexicalEnvironment): Value {
        try {
            return this.codeBlocks.execute(new LexicalEnvironment(le));
        } catch (e: any) {
            output.push(
                `Произошла ошибка в функции ${this.name}. Текст ошибки: ${e.message}`
            );
            throw new Error(
                `Произошла ошибка в функции ${this.name}. Текст ошибки: ${e.message}`
            );
        }
    }

    serialize() {
        return {
            name: this.name,
            returnType: this.returnType.name,
            codeBlocks: this.codeBlocksWrapper_.serialize(),
        };
    }

    static async deserialize(
        data: any,
        changeFunctionList: (fn: CodeBlockFunction) => void,
        output: string[],
        setOutput: (output: string[]) => void
    ): Promise<CodeBlockFunction> {
        const typeMap: Record<string, Class<InterpreterTypes>> = {
            TypeNumber: TypeNumber,
            TypeBool: TypeBool,
            TypeString: TypeString,
            TypeVoid: TypeVoid,
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
            data.name || "Unnamed"
        );

        fn.codeBlocks.updateEventHandlers(
            (e: any, g: any, block: ICodeBlock) =>
                fn.insertNewCodeBlock(e, g, block),
            undefined
        );

        return fn;
    }

    updateEventHandlers() {
        this.codeBlocks.updateEventHandlers(
            this.insertNewCodeBlock.bind(this),
            undefined
        );
    }
}

export default CodeBlockFunction;

