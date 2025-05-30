import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import { Position } from "../../shared/types";
import CCodeBlockWrapper from "../CodeBlockWrapper";
import DropZone from "./DropZone";
import LexicalEnvironment from "./LexicalEnvironment";
import CodeBlockEnvironment from "../../shared/Interfaces/CodeBlockEnvironment";
import ICodeBlock from "../../shared/Interfaces/CodeBlock";
import Value from "./Value";
import SerializedBlock from "./shared/serializationTypes";
import TypeNumber from "../types/TypeNumber";
import { uuidv4 } from "../../shared/functions";

abstract class CCodeBlock extends DropZone implements ICodeBlock {
    next: ICodeBlock | null;
    prev: ICodeBlock | null;
    parent: CCodeBlockWrapper | null;
    id: string;

    constructor(
        next: ICodeBlock | null = null,
        prev: ICodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super();
        this.next = next;
        this.prev = prev;
        this.parent = parent;
        this.id = uuidv4();
    }

    onLayoutHandler(x: number, y: number, w: number, h: number) {
        this.setPositions(x, y, w, h);
    }

    serialize(): SerializedBlock;

    pushCodeBlockAfterThis(newBLock: ICodeBlock) {
        console.log("Adding from code block");
        if (this.next && newBLock.id === this.next.id) return;
        if (this.prev && newBLock.id === this.prev.id) return;
        if (this.id == newBLock.id) return;
        let tmp = this.next;
        newBLock.next = this.next;
        newBLock.prev = this;
        newBLock.parent = this.parent;
        this.next = newBLock;
        if (tmp) tmp.prev = newBLock;
        console.log(newBLock);
    }

    render(props: any) {
        return <></>;
    }
    execute(le: LexicalEnvironment, contextReturn?: Value): Value {
        return new Value(TypeNumber, "-1");
    }
    insertCodeBlock(
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: ICodeBlock
    ): boolean {
        //if (this.checkDropIn(g)) {
        //    this.pushCodeBlockAfterThis(block);
        //    return true;
        //}
        return false;
    }


    abstract serialize(): any;
    
    updateEventHandlers(onDrop: any, onPickUp?: any) {
        this.onDrop = onDrop;
        if (onPickUp && this.onPickUp) this.onPickUp = onPickUp;
        if (this.next) {
            this.next.updateEventHandlers(onDrop, onPickUp);
        }
    }

    removeThisCodeBLock() {
        console.log(this);
        if (this.prev) this.prev.next = this.next;
        if (this.next) this.next.prev = this.prev;
        if (!this.prev && this.parent) this.parent.content = this.next;
    }
}

export default CCodeBlock;


