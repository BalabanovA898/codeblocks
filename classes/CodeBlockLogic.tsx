serialize() {
    return {
        type: "CCodeBlockLogic",
        id: this.id,
        operator: this.operator,
        wrapperLeft: this.wrapperLeft.serialize(),
        wrapperRight: this.wrapperRight.serialize(),
        next: this.next ? this.next.serialize() : null,
    };
}

static async deserialize(data: any, onDrop: any, onPickUp?: any): Promise<CCodeBlockLogic> {
    const wrapperLeft = await CCodeBlockWrapper.deserialize(data.wrapperLeft);
    const wrapperRight = await CCodeBlockWrapper.deserialize(data.wrapperRight);
    const block = new CCodeBlockLogic(wrapperLeft, wrapperRight, onDrop, onPickUp);
    block.id = data.id;
    block.operator = data.operator;

    if (data.next) {
            block.next = await this.deserialize(data.next, onDrop, onPickUp);
            if (block.next) {
                block.next.prev = block;
            }
        }
    return block;
}

// setOperator
setOperator(value: string): void {
    this.operator = value;
}

// render
render(props: any): JSX.Element {
    return (
        <CodeBlockLogic
            key={uuidv4()}
            onDrop={this.onDropHandler.bind(this)}
            onLayout={this.setPositions.bind(this)}
            wrapperLeft={this.wrapperLeft}
            wrapperRight={this.wrapperRight}
            operator={this.operator || ""}
            setValue={this.setOperator.bind(this)}
            rerender={props.rerender}
            onPickUp={this.onPickUp}></CodeBlockLogic>
    );
}

// execute
execute(le: LexicalEnvironment): Value {
    let leftOperand = this.wrapperLeft.execute(new LexicalEnvironment(le));
    let rightOperand = this.wrapperRight.execute(new LexicalEnvironment(le));
    if (leftOperand.type === TypeVoid || rightOperand.type === TypeVoid)
        throw new Error(
            "Ошибка в логическом вырожении. Операнд не может быть типа Void."
        );
    if (!this.operator)
        throw new Error(
            "Ошибка в логичесокм выражении. Необходимо выбрать логическую операцию."
        );

    switch (this.operator) {
        case "=":
            return new Value(
                TypeBool,
                new leftOperand.type().compareEqual(
                    leftOperand,
                    rightOperand
                )
            );
        case "<":
            return new Value(
                TypeBool,
                new leftOperand.type().compareLess(
                    leftOperand,
                    rightOperand
                )
            );
        case ">":
            return new Value(
                TypeBool,
                new leftOperand.type().compareBigger(
                    leftOperand,
                    rightOperand
                )
            );
        case "&&":
            return new Value(
                TypeBool,
                new TypeBool().convertFromOtherType(leftOperand.value) &&
                    new TypeBool().convertFromOtherType(rightOperand.value)
            );
        case "||":
            return new Value(
                TypeBool(),
                new TypeBool().convertFromOtherType(leftOperand.value) ||
                    new TypeBool().convertFromOtherType(rightOperand.value)
            );
        case "Xor":
            return new Value(
                TypeBool(),
                new TypeBool().convertFromOtherType(leftOperand.value) <=
                    new TypeBool().convertFromOtherType(rightOperand.value)
            );
        default:
            throw new Error(
                "Ошибка в логическом выражении. Произошла непредвиденная ошиюбка интерпритации."
            );
    }
}
    }
}

