import { Dispatch, useState, useReducer } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../shared/globalStyles";

interface Props {
    options: string[];
    selectedOption: string;
    onSelect: (selectedOption: string) => void;
}

const Select = (props: Props) => {
    const [active, setActive] = useState<boolean>(false);
    return active ? (
        <ScrollView style={styles.select}>
            {props.options.map((item) => (
                <Pressable
                    onPress={() => {
                        props.onSelect(item);
                        setActive(false);
                    }}
                    style={styles.option}>
                    <Text style={styles.text}>{`○${item}`}</Text>
                </Pressable>
            ))}
        </ScrollView>
    ) : (
        <View style={styles.select}>
            <Pressable
                onPress={() => {
                    setActive(true);
                }}
                style={styles.option}>
                <Text style={styles.text}>▾{props.selectedOption}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    select: {},
    option: {},
    text: {
        fontSize: globalStyles.fontSize,
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.backgroundColor,
    },
});

export default Select;

