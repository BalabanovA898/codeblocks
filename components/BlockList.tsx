import {
    StyleSheet,
    useWindowDimensions,
    View,
    Text,
    PanResponderGestureState,
} from "react-native";

import CodeBlock from "../classes/CodeBlock";
import { Dispatch } from "react";

interface Props {
    isVisible: Boolean;
}

const BlockList = (props: Props, index: Number) => {
    const onDrop = (g: PanResponderGestureState) => {
        console.log(g.moveX, g.moveY);
        //for (let item of props.blocks) {
        //    if (
        //        (g.moveY > item.getDropZoneValue?.y &&
        //            g.moveY <
        //                item.getDropZoneValue.y +
        //                    item.getDropZoneValue.height &&
        //            g.moveX > item.getDropZoneValue?.x &&
        //            g.moveX <
        //                item.getDropZoneValue.x +
        //                    item.getDropZoneValue.width) ||
        //        true
        //    ) {
        //        //DO SOMETHING
        //    }
        //}
    };
    return (
        <View
            style={{
                display: props.isVisible ? "flex" : "none",
                ...styles.container,
            }}></View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 0,
        top: 115,
        zIndex: 2,
        justifyContent: "center",
        alignItems: "flex-end",
        overflow: "visible",
    },
    scrollView: {},
});

export default BlockList;

