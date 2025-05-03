import { Key } from "react";
import { StyleSheet, View } from "react-native";

interface Props {
    key: Key;
    children: React.JSX.Element;
    onLayout: (x: number, y: number, w: number, h: number) => void;
}

const CodeBlockWrapper = (props: Props) => {
    return (
        <View
            style={styles.container}
            key={props.key}
            onLayout={(e) => {
                props.onLayout(
                    e.nativeEvent.layout.x,
                    e.nativeEvent.layout.y,
                    e.nativeEvent.layout.width,
                    e.nativeEvent.layout.height
                );
            }}>
            {props.children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "tomato",
        padding: 4,
    },
});

export default CodeBlockWrapper;

