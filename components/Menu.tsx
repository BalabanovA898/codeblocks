import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { globalStyles } from "../shared/globalStyles";

const LOAD = require("../assets/load.png");
const SAVE = require("../assets/save.png");
const BOOK = require("../assets/book.png");

interface Props {
    isOpen: boolean;
}

const Menu = (props: Props) => {
    return (
        props.isOpen && (
            <View style={styles.container}>
                <Pressable
                    onPress={() => console.log("TODO: Add functionality")}
                    style={styles.button}>
                    <Image
                        source={LOAD}
                        style={styles.buttonImage}></Image>
                    <Text style={styles.buttonText}>Загрузить</Text>
                </Pressable>
                <Pressable
                    onPress={() => console.log("TODO: Add functionality")}
                    style={styles.button}>
                    <Image
                        source={SAVE}
                        style={styles.buttonImage}></Image>
                    <Text style={styles.buttonText}>Сохранить</Text>
                </Pressable>
                <Pressable
                    onPress={() => console.log("TODO: Add functionality")}
                    style={styles.button}>
                    <Image
                        source={BOOK}
                        style={styles.buttonImage}></Image>
                    <Text style={styles.buttonText}>Руководство</Text>
                </Pressable>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: Dimensions.get("window").height / 10,
        width: Dimensions.get("window").width,
        backgroundColor: globalStyles.backgroundColor,
        padding: 25,
        zIndex: 2,
    },
    button: {
        flexDirection: "row",
        marginVertical: 5,
    },
    buttonText: {
        fontSize: Dimensions.get("window").height / 33,
        color: globalStyles.fontColor,
        fontFamily: "Sans Sherif",
    },
    buttonImage: {
        width: Dimensions.get("window").height / 33,
        height: Dimensions.get("window").height / 33,
        marginRight: 10,
    },
});

export default Menu;

