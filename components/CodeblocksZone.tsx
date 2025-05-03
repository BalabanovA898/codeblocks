import {
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";

import CCodeBlockWrapper from "../classes/CodeBlockWrapper";
import { Dispatch, useContext } from "react";

interface Props {
    blocks: CCodeBlockWrapper;
    setCBZO: Dispatch<{ x: number; y: number }>;
}

const CodeblocksZone = ({ blocks, setCBZO }: Props) => {
    const { height } = useWindowDimensions();

    return (
        <View
            style={{ height: height - 105, ...styles.container }}
            onLayout={(e) => {
                console.log(
                    "setCBZO",
                    e.nativeEvent.layout.x,
                    e.nativeEvent.layout.y
                );
                setCBZO({
                    x: e.nativeEvent.layout.x,
                    y: e.nativeEvent.layout.y,
                });
            }}>
            <ScrollView>{blocks.render({ key: Date.now() })}</ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ff00ff",
    },
});

export default CodeblocksZone;

