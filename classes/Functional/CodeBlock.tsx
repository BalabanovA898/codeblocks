import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import { Position } from "../../shared/types";
import CCodeBlockWrapper from "../CodeBlockWrapper";
import DropZone from "./DropZone";
import LexicalEnvironment from "./LexicalEnvironment";
import CodeBlockEnvironment from "../../shared/Interfaces/CodeBlockEnvironment";
import ICodeBlock from "../../shared/Interfaces/CodeBlock";
import Value from "./Value";
import TypeNumber from "../types/TypeNumber";

abstract class CCodeBlock extends DropZone implements ICodeBlock {
    next: ICodeBlock | null;
    prev: ICodeBlock | null;
    parent: CCodeBlockWrapper | null;

    constructor(
        offset: Position,
        next: ICodeBlock | null = null,
        prev: ICodeBlock | null = null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(offset);
        this.next = next;
        this.prev = prev;
        this.parent = parent;
    }

    onLayoutHandler(x: number, y: number, w: number, h: number) {
        this.setPositions(
            x,
            y,
            w,
            h,
            this.parent?.elementX ? this.parent.elementX : 0,
            this.parent?.elementY ? this.parent.elementY : 0
        );
    }

    pushCodeBlockAfterThis(newBLock: ICodeBlock) {
        console.log("I've been added from CodeBlock");
        let tmp = this.next;
        this.next = newBLock;
        if (tmp) tmp.prev = newBLock;
        newBLock.next = tmp;
        newBLock.prev = this;
        this.next.parent = this.parent;
        console.log(this.next);
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
        console.log("Called wrong method!");
        //if (this.checkDropIn(g)) {
        //    this.pushCodeBlockAfterThis(block);
        //    return true;
        //}
        return false;
    }

    removeThisCodeBLock() {
        console.log("block remove");
        console.log(this);
        if (this.prev) {
            this.prev.next = this.next;
            if (this.next) this.next.prev = this.prev;
        }
        if (!this.prev && this.parent) this.parent.content = this.next;
    }
}

export default CCodeBlock;

