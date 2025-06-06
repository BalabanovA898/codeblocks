import {
    Pressable,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
} from "react-native";
import { globalStyles } from "../shared/globalStyles";
import { Dispatch } from "react";
import ICodeBlock from "../shared/Interfaces/CodeBlock";

const START = require("../assets/run.png");
const DEBUG = require("../assets/debug.png");

interface Props {
    executeCode: () => void;
    setIsDebugMode: Dispatch<boolean>;
}

const Footer = (props: Props) => {
    return (
        <View style={styles.container}>
            <Pressable
                style={styles.button}
                onPress={() => {
                    props.setIsDebugMode(true);
                }}>
                <Image
                    source={DEBUG}
                    style={styles.image}></Image>
                <Text style={styles.buttonText}>Отладка</Text>
            </Pressable>
            <Pressable
                style={styles.button}
                onPress={props.executeCode}>
                <Text style={styles.buttonText}>Пуск</Text>
                <Image
                    source={START}
                    style={{
                        ...styles.image,
                        height: Dimensions.get("window").height / 32,
                        width: Dimensions.get("window").height / 36,
                    }}></Image>
            </Pressable>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: globalStyles.backgroundColor,
        flexDirection: "row",
        justifyContent: "space-evenly",
        height: Dimensions.get("window").height / 10,
    },
    button: {
        margin: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontSize: Dimensions.get("window").height / 33,
    },
    image: {
        height: Dimensions.get("window").height / 25,
        width: Dimensions.get("window").height / 25,
        margin: 5,
    },
});

export default Footer;

