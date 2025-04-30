import { View, Text } from "react-native";
import { Key } from "react";

interface Props {
    key: Key;
}

const CodeBlockAsigment = (props: Props) => {
    return (
        <View key={props.key}>
            <Text>a = 10</Text>
        </View>
    );
};

export default CodeBlockAsigment;

