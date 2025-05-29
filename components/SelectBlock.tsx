import {
    Animated,
    GestureResponderEvent,
    PanResponderGestureState,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Draggable from "./Draggable";
import { uuidv4 } from "../shared/functions";
import { PropsWithChildren, Dispatch, DispatchWithoutAction } from "react";
import Renderable from "../shared/Interfaces/Renderable";
import { globalStyles } from "../shared/globalStyles";

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<boolean>;
    blocks: Renderable[];
    rerender: DispatchWithoutAction;
    text: string;
}

const SelectBlock = (props: Props & PropsWithChildren) => {
    return (
        <View style={styles.container}>
            <Pressable onPress={() => props.setIsOpen(!props.isOpen)}>
                <Text style={styles.text}>{`▾${props.text}`}</Text>
            </Pressable>
            {props.isOpen &&
                props.blocks.map((item) => (
                    <View key={uuidv4()}>
                        {item.render({
                            rerender: props.rerender,
                            key: uuidv4(),
                        })}
                    </View>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: globalStyles.fontSize,
        fontFamily: globalStyles.fontFamily,
        color: globalStyles.backgroundColor,
    },
    container: {
        overflow: "visible",
    },
});

export default SelectBlock;

