import { Dispatch, useState, useReducer } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface Props {
    options: string[];
    selectedOption: string;
    onSelect: (selectedOption: string) => void;
}

const Select = (props: Props) => {
    const [active, setActive] = useState<boolean>(false);
    return active ? (
        <ScrollView>
            {props.options.map((item) => (
                <Pressable
                    onPress={() => {
                        props.onSelect(item);
                        setActive(false);
                    }}>
                    <Text>{item}</Text>
                </Pressable>
            ))}
        </ScrollView>
    ) : (
        <View>
            <Pressable
                onPress={() => {
                    setActive(true);
                }}>
                <Text>{props.selectedOption}</Text>
            </Pressable>
        </View>
    );
};

export default Select;

