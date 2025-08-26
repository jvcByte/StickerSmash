import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout() {
    console.log('Auth Layout')
    const { isSignedIn } = useAuth();
    if (isSignedIn) {
        return <Redirect href="/(protected)/(tabs)" />
    }
    return (
        <Stack>
            <Stack.Screen name="sign-in" options={{ headerShown: false, title: 'Sign In' }} />
            <Stack.Screen name="sign-up" options={{ headerShown: false, title: 'Sign Up' }} />
            <Stack.Screen name="verify" options={{ headerShown: false, title: 'Verify' }} />
        </Stack>
    )

}