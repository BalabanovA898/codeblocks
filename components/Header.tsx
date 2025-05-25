import {
    View,
    StyleSheet,
    Pressable,
    Text,
    ImageBackground,
    Dimensions,
    Animated,
} from "react-native";
import { globalStyles } from "../shared/globalStyles";
import { useRef } from "react";
const MENU = require("../assets/menu.png");
const ADD_BLOCK = require("../assets/addBlock.png");

interface Props {
    isBlockListVisible: Boolean;
    setBlockListVisible: React.Dispatch<React.SetStateAction<Boolean>>;
    fileName?: string;
}

const Header = (props: Props) => {
    let addBlockRotateValue = useRef(new Animated.Value(0)).current;

    const spin = addBlockRotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "45deg"],
    });

    return (
        <View style={styles.container}>
            <Pressable style={styles.button}>
                <ImageBackground
                    source={MENU}
                    style={styles.image}></ImageBackground>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>
                    {props.fileName || "Новый файл"}
                </Text>
            </Pressable>
            <Pressable
                style={styles.button}
                onPress={(e) => {
                    Animated.spring(addBlockRotateValue, {
                        toValue: props.isBlockListVisible ? 0 : 1,
                        useNativeDriver: true,
                    }).start();

                    props.setBlockListVisible(!props.isBlockListVisible);
                }}>
                <Animated.Image
                    source={ADD_BLOCK}
                    style={{
                        width: Dimensions.get("window").height / 10 / 3,
                        height: Dimensions.get("window").height / 10 / 3,
                        transform: [{ rotateZ: spin }],
                    }}></Animated.Image>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: globalStyles.backgroundColor,
        justifyContent: "space-between",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height / 10,
        padding: (Dimensions.get("window").height / 10) * 0.33,
        flexDirection: "row",
    },
    button: {
        width: "auto",
        justifyContent: "center",
    },
    buttonText: {
        textAlign: "center",
        fontSize: (Dimensions.get("window").height / 10) * 0.25,
        fontStyle: "italic",
        color: globalStyles.fontColor,
        fontFamily: "Inconsolata Sans Sherif",
    },
    image: {
        width: (Dimensions.get("window").width / 100) * 10,
        height: (Dimensions.get("window").height / 100) * 3.5,
    },
});

export default Header;

