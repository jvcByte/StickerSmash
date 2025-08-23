import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";

export default function SettingsScreen() {
    return (
        <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ThemedText style={{ textAlign: "center" }}>Settings</ThemedText>
        </ThemedView>
    );
}