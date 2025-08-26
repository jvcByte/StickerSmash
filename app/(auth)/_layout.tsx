import { Stack, Redirect } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

type ClerkUser = {
    id: string;
    publicMetadata?: {
        role?: string;
    };
};

export default function AuthLayout() {
    console.log('Auth Layout')
    const { isLoaded, isSignedIn } = useAuth();
    const { user, isLoaded: isUserLoaded } = useUser();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const clerkUser = user as ClerkUser | null | undefined;
    const isAdmin = clerkUser?.publicMetadata?.role;

    useEffect(() => {
        // Only check auth status when both auth and user data are loaded
        if (isLoaded && isUserLoaded) {
            setIsCheckingAuth(false);
        }
    }, [isLoaded, isUserLoaded]);

    // Show loading indicator while checking auth state
    if (isCheckingAuth) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // If user is signed in, redirect to appropriate dashboard
    if (isSignedIn) {
        if (isAdmin === 'admin') {
            return <Redirect href="/(protected)/(admin)" />;
        }
        return <Redirect href="/(protected)/(tabs)" />;
    }
    return (
        <Stack>
            <Stack.Screen name="sign-in" options={{ headerShown: false, title: 'Sign In' }} />
            <Stack.Screen name="sign-up" options={{ headerShown: false, title: 'Sign Up' }} />
            <Stack.Screen name="verify" options={{ headerShown: false, title: 'Verify' }} />
        </Stack>
    )

}