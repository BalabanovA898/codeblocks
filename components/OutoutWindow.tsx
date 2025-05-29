import { Dispatch } from "react";
import {
    ScrollView,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
} from "react-native";
import { uuidv4 } from "../shared/functions";

interface Props {
    massages: string[];
    isActive: boolean;
    setIsActive: Dispatch<boolean>;
}

const OutputWindow = (props: Props) => {
    return (
        <Pressable
            onPress={() => props.setIsActive(false)}
            style={{
                ...styles.container,
                display: props.isActive ? "flex" : "none",
            }}>
            <ScrollView>
                {props.massages.map((item) => (
                    <Text
                        style={styles.text}
                        key={uuidv4()}>
                        {">"} {item}
                    </Text>
                ))}
            </ScrollView>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "100%",
        height: (Dimensions.get("window").height * 8) / 10,
        top: Dimensions.get("window").height / 10,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        left: 0,
    },
    text: {
        fontSize: 18,
        color: "white",
    },
});

export default OutputWindow;

