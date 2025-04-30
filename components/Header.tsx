import { View, StyleSheet, Pressable, Text } from "react-native";

interface Props {
    isBlockListVisible: Boolean;
    setBlockListVisible: React.Dispatch<React.SetStateAction<Boolean>>;
}

const Header = (props: Props) => {
    return (
        <View style={styles.container}>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>"Header"</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>"Header"</Text>
            </Pressable>
            <Pressable
                style={styles.button}
                onPress={(e) => {
                    props.setBlockListVisible(!props.isBlockListVisible);
                }}>
                <Text style={styles.buttonText}>"+"</Text>
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
        height: 75,
        backgroundColor: "#ffffff",
        width: "auto",
        justifyContent: "center",
    },
    buttonText: {
        textAlign: "center",
    },
});

export default Header;

