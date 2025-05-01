import { View, Text, StyleSheet } from "react-native";
import { Key } from "react";

interface Props {
    key: Key;
}

const CodeBlockAsigment = (props: Props) => {
    return (
        <View
            style={styles.container}
            key={props.key}>
            <Text>a = 11</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#aaaa11",
        width: 200,
        margin: 4,
    },
});

export default CodeBlockAsigment;

