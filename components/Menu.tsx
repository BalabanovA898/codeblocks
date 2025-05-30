import {
    Dimensions,
    Image,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from "react-native";
import { globalStyles } from "../shared/globalStyles";

const LOAD = require("../assets/load.png");
const SAVE = require("../assets/save.png");
const BOOK = require("../assets/book.png");
const SAVE_AS = require("../assets/save.png");
const LOAD_FROM = require("../assets/load.png");

interface Props {
    isOpen: boolean;
    onSave: () => void;
    onSaveAs: () => void;
    onLoad: () => void;
    onLoadFrom: () => void;
    isSaving: boolean;
    isLoading: boolean;
}

const Menu = (props: Props) => {
    if (!props.isOpen) return null;

    return (
        <View style={styles.container}>
            <Pressable
                onPress={props.onLoad}
                disabled={props.isLoading}
                style={styles.button}>
                {props.isLoading ? (
                    <ActivityIndicator size="small" color={globalStyles.fontColor} />
                ) : (
                    <>
                        <Image source={LOAD} style={styles.buttonImage} />
                        <Text style={styles.buttonText}>Загрузить</Text>
                    </>
                )}
            </Pressable>
            
            <Pressable
                onPress={props.onLoadFrom}
                disabled={props.isLoading}
                style={styles.button}>
                {props.isLoading ? (
                    <ActivityIndicator size="small" color={globalStyles.fontColor} />
                ) : (
                    <>
                        <Image source={LOAD_FROM} style={styles.buttonImage} />
                        <Text style={styles.buttonText}>Загрузить из...</Text>
                    </>
                )}
            </Pressable>
            
            <Pressable
                onPress={props.onSave}
                disabled={props.isSaving}
                style={styles.button}>
                {props.isSaving ? (
                    <ActivityIndicator size="small" color={globalStyles.fontColor} />
                ) : (
                    <>
                        <Image source={SAVE} style={styles.buttonImage} />
                        <Text style={styles.buttonText}>Сохранить</Text>
                    </>
                )}
            </Pressable>
            
            <Pressable
                onPress={props.onSaveAs}
                disabled={props.isSaving}
                style={styles.button}>
                {props.isSaving ? (
                    <ActivityIndicator size="small" color={globalStyles.fontColor} />
                ) : (
                    <>
                        <Image source={SAVE_AS} style={styles.buttonImage} />
                        <Text style={styles.buttonText}>Сохранить как...</Text>
                    </>
                )}
            </Pressable>
            
            <Pressable
                onPress={() =>
                    Linking.openURL(
                        "https://docs.google.com/document/d/1eHpwdFwr6AqbWtenDK0-cQ5lLrQ4fF3I3z4serbzOSI/edit?usp=sharing"
                    )
                }
                style={styles.button}>
                <Image
                    source={BOOK}
                    style={styles.buttonImage} />
                <Text style={styles.buttonText}>Руководство</Text>
            </Pressable>
        </View>
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
        alignItems: "center",
    },
    buttonText: {
        fontSize: Dimensions.get("window").height / 33,
        color: globalStyles.fontColor,
        fontFamily: "Sans Sherif",
        marginLeft: 10,
    },
    buttonImage: {
        width: Dimensions.get("window").height / 33,
        height: Dimensions.get("window").height / 33,
    },
});

export default Menu;
