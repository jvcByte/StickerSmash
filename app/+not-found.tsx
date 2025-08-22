import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFound() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>404 - Page Not Found</Text>
            <Link href="/" style={styles.link}>Go Home</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(235, 255, 230)",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    link: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        marginTop: 20,
        paddingHorizontal: 35,
        backgroundColor: "blue",
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
});
