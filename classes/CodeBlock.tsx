import { Dispatch, DispatchWithoutAction, Key, RefObject } from "react";
import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import { Position } from "../shared/types";
import CCodeBlockWrapper from "./CodeBlockWrapper";
import DropZone from "./Functional/DropZode";
import CodeBlock from "../components/CodeBlock";
import LexicalEnvironment from "./Functional/LexicalEnvironment";
import Returnable from "../shared/Interfaces/Returnable";
import Value from "./Functional/Value";
import Renderable from "../shared/Interfaces/Renderable";
import CodeBlockEnvironment from "../shared/Interfaces/CodeBlockEnvironment";

interface Props {
    key: Key;
    renderItem: Renderable | null;
    children: CCodeBlockWrapper | null;
    onLayout: (x: number, y: number, w: number, h: number) => void;
    rerender: DispatchWithoutAction;
}

interface ICodeBlock {
    content_: (Renderable & Returnable) | null;
    children: CCodeBlockWrapper | null;
    next_: CCodeBlock | null;
    prev_: CCodeBlock | null;
    parent: CCodeBlockWrapper | null;
    insertCodeBlock: (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ) => boolean;
}

class CCodeBlock
    extends DropZone
    implements ICodeBlock, Returnable, CodeBlockEnvironment
{
    content_: (Renderable & Returnable) | null;
    children: CCodeBlockWrapper | null;
    next_: CCodeBlock | null;
    prev_: CCodeBlock | null;
    render_: (props: Props) => React.JSX.Element;
    le: LexicalEnvironment;
    parent: CCodeBlockWrapper | null;

    constructor(
        offset: Position,
        content: (Renderable & Returnable) | null,
        next: CCodeBlock | null = null,
        prev: CCodeBlock | null = null,
        children: CCodeBlockWrapper | null = null,
        le: LexicalEnvironment | null,
        parent: CCodeBlockWrapper | null = null
    ) {
        super(offset);
        this.content_ = content;
        if (this.content !== null) this.content.parent = this;
        this.next_ = next;
        this.prev_ = prev;
        this.children = children;
        this.render_ = CodeBlock;
        this.le = le ? le : new LexicalEnvironment(null);
        this.parent = parent;
        if (this.children) this.children.parent = this;
    }

    get content() {
        return this.content_;
    }

    get next() {
        return this.next_;
    }

    set next(item: CCodeBlock | null) {
        this.next_ = item;
    }

    get prev() {
        return this.prev_;
    }

    set prev(block: CCodeBlock | null) {
        this.prev_ = block;
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

    renderSequence(props: { key: Key; rerender: DispatchWithoutAction }) {
        return this.render_({
            key: props.key,
            renderItem: this.content,
            children: this.children,
            onLayout: this.onLayoutHandler.bind(this),
            rerender: props.rerender,
        });
    }

    pushCodeBlockAfterThis(newBLock: CCodeBlock) {
        console.log("I've been added from CodeBlock");
        let tmp = this.next;
        this.next = newBLock;
        if (tmp) tmp.prev = newBLock;
        newBLock.next = tmp;
        newBLock.prev = this;
        this.next.le = this.le;
        this.next.offset = this.offset;
        this.next.parent = this.parent;
        console.log(this.next);
    }

    removeThisCodeBLock() {
        if (this.prev) {
            this.prev.next = this.next;
            if (this.next) this.next.prev = this.prev;
        }
        //TODD: Добавить возможно удаление первого эелемента!
    }

    insertCodeBlock = (
        e: GestureResponderEvent,
        g: PanResponderGestureState,
        block: CCodeBlock
    ): boolean => {
        console.log("trying to drop inside:", this);
        let isDropInChildren = this.children?.checkDropIn(g);
        console.log("children drop result: ", isDropInChildren);
        if (this.checkDropIn(g) && !isDropInChildren) {
            this.pushCodeBlockAfterThis(block);
            console.log("YES");
            return true;
        } else if (isDropInChildren && this.children)
            return this.children.insertCodeBlock(e, g, block);
        else if (this.next_) return this.next_.insertCodeBlock(e, g, block);
        return false;
    };

    execute(le: LexicalEnvironment): Value {
        let contextReturn;
        if (this.children) contextReturn = this.children.execute();
        if (this.content) return this.content.execute(le, contextReturn);
        throw new Error(
            "Ошибка при попытке выполинть команду! Ощиюка может быть вызвана пустыми полями."
        );
    }
}

export default CCodeBlock;

