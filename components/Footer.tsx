import { Pressable, View, Text, StyleSheet } from "react-native";

const Footer = () => {
    return (
        <View style={styles.container}>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>"Footer"</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>"Footer"</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>"Footer"</Text>
            </Pressable>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffff00",
        justifyContent: "space-around",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        flexGrow: 1,
        margin: 5,
        height: 55,
        backgroundColor: "#ffffff",
        width: "auto",
        justifyContent: "center",
    },
    buttonText: {
        textAlign: "center",
    },
});

export default Footer;

