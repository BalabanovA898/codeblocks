import { DispatchWithoutAction, Key } from "react";
import {
    GestureResponderEvent,
    PanResponderGestureState,
} from "react-native";
import CodeBlockWrapper from "../components/CodeBlockWrapper";
import DropZone from "./Functional/DropZone";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Returnable from "../shared/Interfaces/Returnable";
import Value from "./Functional/Value";
import TypeNumber from "./types/TypeNumber";
import ICodeBlock from "../shared/Interfaces/CodeBlock";
import { uuidv4 } from "../shared/functions";
import TypeVoid from "./types/TypeVoid";

// Импорты всех типов блоков
import CCodeBlockArrayInit from "./CodeBlockArrayInit";
import CCodeBlockAssignment from "./CodeBlockAssignment";
import CCodeBlockBreak from "./CodeBlockBreak";
import CCodeBlockGetVariableValue from "./CodeBlockGetVariable";
import CCodeBlockIfStatement from "./CodeBlockIfStatement";
import CCodeBlockLogic from "./CodeBlockLogic";
import CCodeBlockLogicNot from "./CodeBlockLogicNot";
import CCodeBlockMath from "./CodeBlockMath";
import CCodeBlockPrint from "./CodeBlockPrint";
import CCodeBlockValue from "./CodeBlockValue";
import CCodeBlockWhile from "./CodeBlockWhile";

interface ICodeBlockWrapper {
    content: ICodeBlock | null;
    render_: (props: {
        key: Key;
        onLayout: (x: number, y: number, w: number, h: number) => void;
        firstElement: ICodeBlock | null;
        rerender: DispatchWithoutAction;
    }) => React.JSX.Element;
    render: (props: any) => React.JSX.Element;
    insertCodeBlock: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) => boolean;
    parent: ICodeBlock | null;
}

interface SerializedCCodeBlockWrapper {
  type: "CCodeBlockWrapper";
  content: any | null;
  next: any[];
}

class CCodeBlockWrapper
    extends DropZone
    implements ICodeBlockWrapper, Returnable
{
    content: ICodeBlock | null;
    render_: (props: {
        key: Key;
        onLayout: (x: number, y: number, w: number, h: number) => void;
        firstElement: ICodeBlock | null;
        rerender: DispatchWithoutAction;
    }) => React.JSX.Element = CodeBlockWrapper;
    parent: ICodeBlock | null;
    next: CCodeBlockWrapper[] = []; // Важно: добавить поле next

    constructor(content: ICodeBlock | null, parent: ICodeBlock | null = null) {
        super();
        this.content = content;
        this.parent = parent;

        this.render = this.render.bind(this);
    }

    render(props: any) {
        return this.render_({
            onLayout: this.setPositions.bind(this),
            key: uuidv4(),
            firstElement: this.content,
            rerender: props.rerender,
        });
    }

    pushBackCodeBlock(newBlock: ICodeBlock) {
        console.log("adding from wrapper");
        if (!this.content) return;
        let currentNode = this.content;
        while (currentNode.next) currentNode = currentNode.next;
        if (currentNode.id == newBlock.id) return;
        currentNode.next = newBlock;
        newBlock.parent = this;
        newBlock.prev = currentNode;
        newBlock.next = null;
    }

    insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ) {
        console.log("Доабвление в Wrapper");
        if (this.checkDropIn(g)) {
            if (this.content == null) {
                this.content = block;
                this.content.parent = this;
                this.content.prev = null;
                this.content.next = null;
                return true;
            } else if (this.content !== null) {
                if (this.content.insertCodeBlock(e, g, block)) return true;
                else {
                    this.pushBackCodeBlock(block);
                    return true;
                }
            }
        }
        return false;
    }
    
    execute(le: LexicalEnvironment) {
        let valueToReturn: Value = new Value(TypeVoid, "");
        let currentNode = this.content;
        while (currentNode) {
            valueToReturn = currentNode.execute(le);
            currentNode = currentNode.next;
            if (valueToReturn.type !== TypeVoid) break;
        }
        return valueToReturn;
    }

   serialize(): SerializedCCodeBlockWrapper {
    return {
      type: "CCodeBlockWrapper",
      content: this.content ? this.content.serialize() : null,
      next: this.next.map(wrapper => wrapper.serialize()),
    };
    }

    static async deserialize(data: any): Promise<CCodeBlockWrapper> {
        const content = data.content ? 
            await this.deserializeCodeBlock(data.content) : 
            null;
        
        const wrapper = new CCodeBlockWrapper(content);
        
        // КРИТИЧЕСКИ ВАЖНО: Восстановите React-компонент
        wrapper.render_ = CodeBlockWrapper;
        
        // Восстановите цепочку next
        wrapper.next = await Promise.all(
            data.next.map((nextData: any) => 
                CCodeBlockWrapper.deserialize(nextData)
            )
        );
        
        // Восстановите прототип
        Object.setPrototypeOf(wrapper, CCodeBlockWrapper.prototype);
        
        // Привяжите методы
        wrapper.render = wrapper.render.bind(wrapper);
        wrapper.insertCodeBlock = wrapper.insertCodeBlock.bind(wrapper);
        wrapper.execute = wrapper.execute.bind(wrapper);
        wrapper.serialize = wrapper.serialize.bind(wrapper);
        
        return wrapper;
    }

    // Добавить метод обновления обработчиков
    updateEventHandlers(onDrop: any, onPickUp?: any) {
        if (this.content && this.content.updateEventHandlers) {
            this.content.updateEventHandlers(onDrop, onPickUp);
        }
        this.next.forEach(wrapper => {
            wrapper.updateEventHandlers(onDrop, onPickUp);
        });
    }
    
    // Метод для десериализации блоков
    public static async deserializeCodeBlock(data: any): Promise<ICodeBlock | null> {
        if (!data) return null;
        
        const blockClasses: Record<string, any> = {
            'CCodeBlockWrapper': CCodeBlockWrapper,
            'CCodeBlockArrayInit': CCodeBlockArrayInit,
            'CCodeBlockAssignment': CCodeBlockAssignment,
            'CCodeBlockBreak': CCodeBlockBreak,
            'CCodeBlockGetVariableValue': CCodeBlockGetVariableValue,
            'CCodeBlockIfStatement': CCodeBlockIfStatement,
            'CCodeBlockLogic': CCodeBlockLogic,
            'CCodeBlockLogicNot': CCodeBlockLogicNot,
            'CCodeBlockMath': CCodeBlockMath,
            'CCodeBlockPrint': CCodeBlockPrint,
            'CCodeBlockValue': CCodeBlockValue,
            'CCodeBlockWhile': CCodeBlockWhile,
        };
        
        if (data.type && blockClasses[data.type]) {
            try {
                let block: ICodeBlock | null = null;
                
                if (data.type === 'CCodeBlockPrint') {
                    block = await blockClasses[data.type].deserialize(
                        data, 
                        () => {}, 
                        [], 
                        () => {}, 
                        () => {}
                    );
                } else {
                    block = await blockClasses[data.type].deserialize(
                        data, 
                        () => {}, 
                        () => {}
                    );
                }
                
                if (block) {
                    const BlockClass = blockClasses[data.type];
                    Object.setPrototypeOf(block, BlockClass.prototype);
                    
                    if (block.render) block.render = block.render.bind(block);
                    if (block.insertCodeBlock) block.insertCodeBlock = block.insertCodeBlock.bind(block);
                    if (block.execute) block.execute = block.execute.bind(block);
                    if (block.serialize) block.serialize = block.serialize.bind(block);
                    
                    if (data.type === 'CCodeBlockWrapper' && block instanceof CCodeBlockWrapper) {
                        (block as CCodeBlockWrapper).render_ = CodeBlockWrapper;
                    }
                }
                
                return block;
            } catch (e) {
                console.error(`Error deserializing ${data.type}:`, e);
                return null;
            }
        }
        
        return null;
    }
}

export default CCodeBlockWrapper;
