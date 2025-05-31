import CCodeBlockAssignment from "../CodeBlockAssignment";
import CCodeBlockValue from "../CodeBlockValue";
import CCodeBlockArrayInit from "../CodeBlockArrayInit";
import CCodeBlockBreak from "../CodeBlockBreak";
import CCodeBlockGetVariableValue from "../CodeBlockGetVariable";
import CCodeBlockIfStatement from "../CodeBlockIfStatement";
import CCodeBlockLogic from "../CodeBlockLogic";
import CCodeBlockLogicNot from "../CodeBlockLogicNot";
import CCodeBlockMath from "../CodeBlockMath";
import CCodeBlockPrint from "../CodeBlockPrint";
import CCodeBlockWhile from "../CodeBlockWhile";
import CCodeBlockWrapper from "../CodeBlockWrapper";
import ICodeBlock from "../../shared/Interfaces/CodeBlock";

export async function deserializeAnyBlock(
    data: any,
    onDrop: (e: any, g: any, block: ICodeBlock) => void,
    onPickUp?: () => void
): Promise<ICodeBlock | null> {
    if (!data || !data.type) {
        console.warn("BlockDeserializer: Invalid data", data);
        return null;
    }

    try {
        switch (data.type) {
            case "CCodeBlockAssignment":
                return await CCodeBlockAssignment.deserialize(
                    data,
                    onDrop,
                    onPickUp
                );
            case "CCodeBlockValue":
                return await CCodeBlockValue.deserialize(
                    data,
                    onDrop,
                    onPickUp
                );
            case "CCodeBlockArrayInit":
                return await CCodeBlockArrayInit.deserialize(
                    data,
                    onDrop,
                    onPickUp
                );
            case "CCodeBlockBreak":
                return await CCodeBlockBreak.deserialize(
                    data,
                    onDrop,
                    onPickUp
                );
            case "CCodeBlockGetVariableValue":
                return await CCodeBlockGetVariableValue.deserialize(
                    data,
                    onDrop,
                    onPickUp
                );
            case "CCodeBlockIfStatement":
                return await CCodeBlockIfStatement.deserialize(
                    data,
                    onDrop,
                    onPickUp
                );
            case "CCodeBlockLogic":
                return await CCodeBlockLogic.deserialize(
                    data,
                    onDrop,
                    onPickUp
                );
            case "CCodeBlockLogicNot":
                return await CCodeBlockLogicNot.deserialize(
                    data,
                    onDrop,
                    onPickUp
                );
            case "CCodeBlockMath":
                return await CCodeBlockMath.deserialize(data, onDrop, onPickUp);
            case "CCodeBlockPrint":
                // Исправление для CCodeBlockPrint
                return await CCodeBlockPrint.deserialize(
                    data,
                    onDrop,
                    onPickUp
                );
            case "CCodeBlockWhile":
                return await CCodeBlockWhile.deserialize(
                    data,
                    onDrop,
                    onPickUp
                );
            case "CCodeBlockWrapper":
                // Исправление для CCodeBlockWrapper
                return (await CCodeBlockWrapper.deserialize(
                    data
                )) as unknown as ICodeBlock;
            default:
                console.warn(`Unknown block type: ${data.type}`);
                return null;
        }
    } catch (e) {
        console.error(`Error deserializing ${data.type}:`, e);
        return null;
    }
}
