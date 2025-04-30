import { View, StyleSheet, Text, ScrollView } from "react-native";

const FunctionNavigator = () => {
    return (
        <ScrollView
            style={styles.container}
            horizontal={true}>
            <Text style={styles.function}>function</Text>
            <Text style={styles.function}>function</Text>
            <Text style={styles.function}>function</Text>
            <Text style={styles.function}>function</Text>
            <Text style={styles.function}>function</Text>
            <Text style={styles.function}>function</Text>
            <Text style={styles.function}>function</Text>
            <Text style={styles.function}>function</Text>
            <Text style={styles.function}>function</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ff0000",
        height: 30,
        padding: 2.5,
    },
    function: {
        backgroundColor: "#ffffff",
        margin: 3,
    },
});
export default FunctionNavigator;

