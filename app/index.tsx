import { StyleSheet } from "react-native"
import { Link } from "expo-router"
import { useAuth } from "@clerk/clerk-expo"
import CustomButton from "@/components/ui/CustomButton";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function WelcomeScreen() {
    const { signOut, isSignedIn } = useAuth();

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}> Welcome Screen</ThemedText>
            <ThemedText>{isSignedIn ? 'You are signed in' : 'You are signed out'}</ThemedText>
            <ThemedView style={styles.linkContainer}>
                <Link href="/sign-in" style={styles.link}>Sign In</Link>
                <Link href="/sign-up" style={styles.link}>Sign Up</Link>
                <Link href="/verify" style={styles.link}>Verify</Link>
                <Link href="/(protected)/(tabs)" style={styles.link}>Go to Protected Screen</Link>
                <Link href="/(protected)/(admin)" style={styles.link}>Go to Admin Screen</Link>
            </ThemedView>
            <CustomButton
                text="Sign Out"
                onPress={() => signOut()}
                style={{ width: 200 }}
            />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
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