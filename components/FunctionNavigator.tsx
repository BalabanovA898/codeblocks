import { View, StyleSheet, Text, ScrollView, Pressable } from "react-native";
import CodeBlockFunction from "../classes/CodeBlockFunction";
import { Dispatch } from "react";
import { uuidv4 } from "../shared/functions";

interface Props {
    functions: CodeBlockFunction[];
    setCurrentFunction: Dispatch<number>;
    countOfFunctions: number;
}

const FunctionNavigator = (props: Props) => {
    let ar = [];
    for (let i = 0; i < props.countOfFunctions; ++i) {
        ar.push(
            <View
                style={styles.function}
                key={uuidv4()}>
                <Pressable
                    onPress={() => {
                        props.setCurrentFunction(i);
                    }}>
                    <Text>{props.functions[i].name}</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            horizontal={true}>
            {ar}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ff0000",
        height: 30,
        padding: 2.5,
    },
    function: {
        backgroundColor: "#ffffff",
        margin: 3,
    },
});
export default FunctionNavigator;

