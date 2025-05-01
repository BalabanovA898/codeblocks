import { RenderContent } from "../types/types";
import { Key } from "react";
import { StyleSheet, View } from "react-native";

interface ICodeBlock {
    content_: RenderContent;
    children: Array<CodeBlock>;
    next_: CodeBlock | null;
    render: (props: { key: Key }) => React.JSX.Element;
}

class CodeBlock implements ICodeBlock {
    content_: RenderContent;
    next_: CodeBlock | null;
    children: CodeBlock[];

    constructor(
        content: RenderContent,
        next: CodeBlock | null,
        ...children: Array<CodeBlock>
    ) {
        this.content_ = content;
        this.next_ = next;
        this.children = children;
    }

    get content() {
        return this.content_;
    }

    get next() {
        return this.next_;
    }

    render(props: { key: Key }) {
        return (
            <View
                key={props.key}
                style={styles.container}>
                {this.content.render({ key: Date.now() })}
                {(() => {
                    if (this.children.length)
                        return (
                            <View style={styles.children}>
                                {this.children.map((item) =>
                                    item.render({ key: Date.now() })
                                )}
                            </View>
                        );
                })()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0000ff",
        padding: 4,
    },
    children: {
        backgroundColor: "orange",
        padding: 4,
    },
});
export default CodeBlock;

