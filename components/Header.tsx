import {
    View,
    StyleSheet,
    Pressable,
    Text,
    ImageBackground,
    Dimensions,
    Animated,
    SafeAreaView,
} from "react-native";
import { globalStyles } from "../shared/globalStyles";
import { Dispatch, useRef } from "react";
import Menu from "./Menu";
const MENU = require("../assets/menu.png");
const ADD_BLOCK = require("../assets/addBlock.png");

interface Props {
    isBlockListVisible: Boolean;
    setBlockListVisible: React.Dispatch<React.SetStateAction<Boolean>>;
    isMenuOpen: boolean;
    setIsMenuOpen: Dispatch<boolean>;
    fileName?: string;
    onSave: () => void;
    onLoad: () => void;
    isSaving: boolean;
    isLoading: boolean;
}

const Header = (props: Props) => {
    let addBlockRotateValue = useRef(new Animated.Value(0)).current;
    let MenuScaleValue = useRef(new Animated.Value(1)).current;

    const spin = addBlockRotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "45deg"],
    });

    return (
        <>
            <SafeAreaView />
            <View style={{ ...styles.container }}>
                <Pressable
                    style={styles.button}
                    onPress={() => {
                        Animated.spring(MenuScaleValue, {
                            toValue: props.isMenuOpen ? 1 : 1.25,
                            useNativeDriver: true,
                        }).start();
                        props.setIsMenuOpen(!props.isMenuOpen);
                    }}>
                    <Animated.Image
                        source={MENU}
                        style={{
                            ...styles.image,
                            transform: [{ scaleY: MenuScaleValue }],
                        }}></Animated.Image>
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
            
            {/* Добавьте Menu сюда с нужными пропсами */}
            <Menu 
                isOpen={props.isMenuOpen}
                onSave={props.onSave}
                onLoad={props.onLoad}
                isSaving={props.isSaving}
                isLoading={props.isLoading}
            />
        </>
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
