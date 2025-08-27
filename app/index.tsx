import { ActivityIndicator, StyleSheet, View, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { useAuth, useUser } from "@clerk/clerk-expo"
import { Ionicons } from '@expo/vector-icons';
import CustomButton from "@/components/ui/CustomButton";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const FeatureCard = ({ icon, title, description, onPress }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    onPress: () => void;
}) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    
    return (
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.background }]}
            onPress={onPress}
        >
            <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                <Ionicons name={icon} size={24} color={colors.tint} />
            </View>
            <ThemedText style={styles.cardTitle}>{title}</ThemedText>
            <ThemedText style={[styles.cardDescription, { color: colors.tabIconDefault }]}>
                {description}
            </ThemedText>
        </TouchableOpacity>
    );
};

export default function WelcomeScreen() {
    const { signOut, isSignedIn, isLoaded } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { user } = useUser();

    if (!isLoaded) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
            </ThemedView>
        );
    }

    if (isSignedIn) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.header}>
                    <View style={[styles.logoContainer, { backgroundColor: colors.tint + '20' }]}>
                        <Ionicons name="car-sport" size={60} color={colors.tint} />
                    </View>
                    <ThemedText style={styles.welcomeText}>Welcome Back! {user?.firstName}</ThemedText>
                    <ThemedText style={[styles.subtitle, { color: colors.tabIconDefault }]}>
                        What would you like to do today?
                    </ThemedText>
                </View>

                <View style={styles.grid}>
                    <FeatureCard
                        icon="car-sport"
                        title="My Vehicles"
                        description="View and manage your vehicles"
                        onPress={() => router.push('/(protected)/(tabs)')}
                    />
                    <FeatureCard
                        icon="calendar"
                        title="Appointments"
                        description="Schedule and view service appointments"
                        onPress={() => router.push('/(protected)/(tabs)/services/schedule')}
                    />
                    <FeatureCard
                        icon="document-text"
                        title="Documents"
                        description="Access your service history and receipts"
                        onPress={() => router.push('/(protected)/(tabs)/documents')}
                    />
                    <FeatureCard
                        icon="settings"
                        title="Settings"
                        description="Update your profile and preferences"
                        onPress={() => router.push('/(protected)/(tabs)/profile')}
                    />
                </View>

                <View style={styles.footer}>
                    <CustomButton
                        text="Sign Out"
                        onPress={() => signOut()}
                        style={styles.signOutButton}
                        textStyle={{ color: colors.text }}
                    />
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.logoContainer, { backgroundColor: colors.tint + '20' }]}>
                    <Ionicons name="car-sport" size={60} color={colors.tint} />
                </View>
                <ThemedText style={styles.welcomeText}>Welcome to ROA AutoTech</ThemedText>
                <ThemedText style={[styles.subtitle, { color: colors.tabIconDefault }]}>
                    Your trusted partner for vehicle maintenance and service
                </ThemedText>
            </View>

            <View style={styles.buttonContainer}>
                <CustomButton
                    text="Sign In"
                    onPress={() => router.push('/sign-in')}
                    style={[styles.button, { backgroundColor: colors.tint }]}
                />
                <CustomButton
                    text="Create Account"
                    onPress={() => router.push('/sign-up')}
                    style={[styles.button, styles.outlineButton]}
                    textStyle={{ color: colors.tint }}
                />
                <TouchableOpacity 
                    style={styles.guestButton}
                    onPress={() => router.push('/(protected)/(tabs)')}
                >
                    <ThemedText style={{ color: colors.tint }}>Continue as Guest</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        lineHeight: 36,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 8,
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    button: {
        width: '100%',
        marginBottom: 15,
        borderRadius: 10,
        paddingVertical: 15,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#4353fd',
    },
    guestButton: {
        alignItems: 'center',
        padding: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        width: '48%',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 12,
        opacity: 0.8,
    },
    footer: {
        marginTop: 'auto',
        paddingBottom: 30,
        width: '100%',
    },
    signOutButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ff3b30',
        width: '100%',
    },
});