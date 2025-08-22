import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

type ButtonProps = {
    label: string;
    theme?: "primary" | "secondary";
    onPress?: () => void;
};

export default function Button({ label, theme, onPress }: ButtonProps) {
    if (theme === "primary") {
        return (
            <View
                style={[
                    styles.buttonContainer,
                    {
                        borderColor: "blue",
                        borderWidth: 2,
                        borderRadius: 10,
                        backgroundColor: "white",
                        marginTop: 20,
                    }
                ]}
            >
                <Pressable
                    style={styles.button}
                    onPress={onPress}
                >
                    <FontAwesome
                        name="picture-o"
                        size={18}
                        color="blue"
                        style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        );
    }

    if (theme === "secondary") {
        return (
            <View style={styles.buttonContainer}>
                <Pressable
                    style={styles.button}
                    onPress={onPress}
                >
                    <FontAwesome name="picture-o" size={18} color="blue" />    
                    <Text style={styles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.buttonContainer}>
            <Pressable
                style={styles.button}
                onPress={onPress}
            >
                <Ionicons name="image" size={24} color="blue" />    
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        // marginHorizontal: 20,
        // alignItems: "center",
        // justifyContent: "center",
        // padding: 3,
        marginVertical: 10,
    },
    button: {
        backgroundColor: "white",
        borderRadius: 10,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: "blue",
        fontSize: 16,
        fontWeight: "bold",
    },
});