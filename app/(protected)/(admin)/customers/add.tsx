import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import CustomButton from "@/components/ui/CustomButton";

export default function AddCustomer() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText>Add Customer</ThemedText>
            <CustomButton
                text="Add Customer"
                onPress={() => { }}
            />

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkContainer: {
        flexDirection: 'row',
        flexShrink: 1,
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'center'
    },
    link: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#4353fd',
        color: '#fff',
        fontWeight: 'bold',
        paddingHorizontal: 20,
    }
})
