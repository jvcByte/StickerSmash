import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type ClerkUser = {
    id: string;
    publicMetadata?: {
        role?: string;
    };
};

export default function AuthLayout() {
    console.log('Auth Layout')
    const { isLoaded: isAuthLoaded, isSignedIn } = useAuth() || {};
    const { user, isLoaded: isUserLoaded } = useUser() || {};
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const clerkUser = user as ClerkUser | null | undefined;
    const isAdmin = clerkUser?.publicMetadata?.role;

    useEffect(() => {
        // Only check auth status when both auth and user data are loaded
        if (isAuthLoaded && isUserLoaded) {
            console.log('Auth check complete', { isSignedIn, isAdmin });
            setIsCheckingAuth(false);
        }
    }, [isAuthLoaded, isUserLoaded, isSignedIn, isAdmin]);

    // If Clerk isn't loaded yet, show loading state
    if (!isAuthLoaded || !isUserLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

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
        console.log('User is signed in, redirecting...', { isAdmin });
        if (isAdmin === 'admin') {
            return <Redirect href="/(protected)/(admin)" />;
        }
        return <Redirect href="/(protected)/(tabs)" />;
    }
    return (
        <Stack>
            <Stack.Screen name="sign-in" options={{ headerShown: false, title: 'Sign In' }} />
            <Stack.Screen name="sign-up" options={{ headerShown: false, title: 'Sign Up' }} />
            <Stack.Screen name="verify"
                options={{
                    headerShown: true,
                    title: '',
                    headerLeft: () => <></>,
                    headerShadowVisible: false,
                }} />
            <Stack.Screen name="forgot-password" options={{ headerShown: false, title: 'Forgot Password' }} />
            <Stack.Screen name="reset-password" options={{ headerShown: false, title: 'Reset Password' }} />
        </Stack>
    )

}