import {
    Animated,
    Text,
    StyleSheet,
    GestureResponderHandlers,
} from "react-native";
import { Key } from "react";
import CCodeBlock from "../classes/CodeBlock";

interface Props {
    key: Key;
    panResponderHandlers: GestureResponderHandlers;
    position: Animated.ValueXY;
}

const CodeBlockAsigment = (props: Props) => {
    return (
        <Animated.View
            style={[
                { transform: props.position.getTranslateTransform() },
                styles.container,
            ]}
            key={props.key}
            {...props.panResponderHandlers}>
            <Text>a = 11</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#aaaa11",
        width: 200,
        margin: 4,
        zIndex: 100,
    },
});

export default CodeBlockAsigment;

