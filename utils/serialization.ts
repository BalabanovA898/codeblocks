import CodeBlockFunction from "../classes/CodeBlockFunction";
import { SerializedProject } from "../types";

// Сериализация проекта
export const serializeProject = (
    functions: CodeBlockFunction[],
    currentFunction: number,
    fileName: string
): SerializedProject => {
    return {
        meta: {
            version: "1.0",
            savedAt: new Date().toISOString(),
        },
        fileName,
        currentFunction,
        functions: functions.map(fn => fn.serialize()),
    };
};

// Десериализация проекта
export const deserializeProject = async (
    data: SerializedProject,
    changeFunctionList: (fn: CodeBlockFunction) => void,
    output: string[],
    setOutput: (output: string[]) => void
): Promise<{
    functions: CodeBlockFunction[];
    currentFunction: number;
    fileName: string;
}> => {
    const functions = await Promise.all(
        data.functions.map(fnData => 
            CodeBlockFunction.deserialize(fnData, changeFunctionList, output, setOutput)
        )
    );

    return {
        functions,
        currentFunction: data.currentFunction,
        fileName: data.fileName,
    };
};