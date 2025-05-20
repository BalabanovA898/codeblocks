import { Dispatch } from "react";
import { ScrollView, Text, Pressable, StyleSheet } from "react-native";

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
                    <Text style={styles.text}>
                        {">"} {item}
                    </Text>
                ))}
            </ScrollView>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        top: 0,
        left: 0,
    },
    text: {
        fontSize: 18,
        color: "white",
    },
});

export default OutputWindow;

