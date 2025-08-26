import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function CustomerList() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText>Customer List</ThemedText>
            <ThemedView style={styles.linkContainer}>
                <Link href="/(protected)/(tabs)/customers/[id]" style={styles.link}>View Customers</Link>
                <Link href="/(protected)/(tabs)/customers/add" style={styles.link}>Add Customer</Link>
            </ThemedView>
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
});