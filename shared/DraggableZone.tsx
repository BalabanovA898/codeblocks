import { ComponentElement, JSXElementConstructor, ReactElement } from "react";
import { View, Text, StyleSheet } from "react-native";

const DraggableZone = (props: any) => {
    return <View style={styles.DraggableZone}>{props.children}</View>;
};

const styles = StyleSheet.create({
    DraggableZone: {
        backgroundColor: "#ff00ff",
        height: "100%",
        width: "100%",
    },
});

export default DraggableZone;

