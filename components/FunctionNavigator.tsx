import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Pressable,
    Dimensions,
} from "react-native";
import CodeBlockFunction from "../classes/CodeBlockFunction";
import { Dispatch } from "react";
import { uuidv4 } from "../shared/functions";
import { globalStyles } from "../shared/globalStyles";

interface Props {
    functions: CodeBlockFunction[];
    setCurrentFunction: Dispatch<number>;
    countOfFunctions: number;
}

const FunctionNavigator = (props: Props) => {
    let ar = [];
    for (let i = 0; i < props.countOfFunctions; ++i) {
        ar.push(
            <Pressable
                key={uuidv4()}
                onPress={() => {
                    props.setCurrentFunction(i);
                }}>
                <View style={styles.function}>
                    <Text style={styles.text}>{props.functions[i].name}</Text>
                </View>
            </Pressable>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView horizontal={true}>{ar}</ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#090917",
        height: Dimensions.get("window").height / 20,
        padding: 3,
    },
    function: {
        backgroundColor: "#2C2C43",
        margin: 3,
        width: Dimensions.get("window").width / 5,
        borderRadius: 2.5,
    },
    text: {
        fontSize: Dimensions.get("window").height / 33,
        textAlign: "center",
        color: globalStyles.fontColor,
    },
});
export default FunctionNavigator;

