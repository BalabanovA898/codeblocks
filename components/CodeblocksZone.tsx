import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";

import CCodeBlockWrapper from "../classes/CodeBlockWrapper";
import { Dispatch, useContext, useReducer } from "react";
import { uuidv4 } from "../shared/functions";

const BACKGROUND = require("../assets/background.png");

interface Props {
    blocks: CCodeBlockWrapper;
    setCBZO: Dispatch<{ x: number; y: number }>;
}

const CodeblocksZone = ({ blocks, setCBZO }: Props) => {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    return (
        <View
            style={{ ...styles.container }} //TODO: Починить адаптивность.
            onLayout={(e) => {
                setCBZO({
                    x: e.nativeEvent.layout.x,
                    y: e.nativeEvent.layout.y,
                });
            }}>
            <ImageBackground
                source={BACKGROUND}
                style={styles.backgroundImage}>
                <ScrollView>
                    {blocks.render({
                        key: uuidv4(),
                        rerender: forceUpdate,
                    })}
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#9D9D9D",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "repeat",
    },
});

export default CodeblocksZone;

