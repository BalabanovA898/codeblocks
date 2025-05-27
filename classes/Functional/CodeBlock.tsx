import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import { Position } from "../../shared/types";
import CCodeBlockWrapper from "../CodeBlockWrapper";
import DropZone from "./DropZone";
import LexicalEnvironment from "./LexicalEnvironment";
import CodeBlockEnvironment from "../../shared/Interfaces/CodeBlockEnvironment";
import ICodeBlock from "../../shared/Interfaces/CodeBlock";
import Value from "./Value";
import TypeNumber from "../types/TypeNumber";
import { uuidv4 } from "../../shared/functions";

abstract class CCodeBlock extends DropZone implements ICodeBlock {
    next: ICodeBlock | null;
    prev: ICodeBlock | null;
    parent: CCodeBlockWrapper | null;
    id: string;

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
        this.id = uuidv4();
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
        if (this.next && newBLock.id === this.next.id) return;
        if (this.prev && newBLock.id === this.prev.id) {
            const tmpPrevPrev = this.prev.prev;
            this.prev.next = this.next;
            this.next = this.prev;
            this.prev = tmpPrevPrev;
            this.prev.prev = this;
        }
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

    removeThisCodeBLock() {
        console.log(this);
        if (this.prev) this.prev.next = this.next;
        if (this.next) this.next.prev = this.prev;
        if (!this.prev && this.parent) this.parent.content = this.next;
    }
}

export default CCodeBlock;

