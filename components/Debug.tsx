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

const NEXT = require("../assets/next.png");
const CANCEL = require("../assets/cancel.png");

interface Props {
    nextStep: () => void;
    setIsDebugMode: Dispatch<boolean>;
    setDebugBlock: Dispatch<ICodeBlock | null>;
}

const Debug = (props: Props) => {
    return (
        <View style={styles.container}>
            <Pressable
                style={styles.button}
                onPress={() => {
                    props.setIsDebugMode(false);
                    props.setDebugBlock(null);
                }}>
                <Image
                    source={CANCEL}
                    style={styles.image}></Image>
                <Text style={styles.buttonText}>Закончить</Text>
            </Pressable>
            <Pressable
                style={styles.button}
                onPress={props.nextStep}>
                <Text style={styles.buttonText}>Далее</Text>
                <Image
                    source={NEXT}
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

export default Debug;

