import {
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";

import CodeBlock from "../classes/CodeBlock";

interface Props {
    blocks: CodeBlock;
}

const CodeblocksZone = ({ blocks }: Props) => {
    const { height } = useWindowDimensions();

    return (
        <View style={{ height: height - 105, ...styles.container }}>
            <ScrollView>{blocks.render({ key: Date.now() })}</ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ff00ff",
    },
});

export default CodeblocksZone;

