import CustomButton from "./ui/CustomButton";
import { useEffect, useCallback } from "react";
import * as WebBrowser from 'expo-web-browser';
import { useSSO, useUser } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";

export const useWarmUpBrowser = () => {
    useEffect(() => {
        // Preloads the browser for Android devices to reduce authentication load time
        // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
        void WebBrowser.warmUpAsync()
        return () => {
            // Cleanup: closes browser when component unmounts
            void WebBrowser.coolDownAsync()
        }
    }, [])
}

// Handle any pending auth sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInWithGoogle() {
    const { isLoaded: isUserLoaded } = useUser();
    const { startSSOFlow } = useSSO();
    
    useWarmUpBrowser();

    const onPress = useCallback(async () => {
        if (!isUserLoaded) return;
        
        try {
            // Start the authentication process by calling `startSSOFlow()`
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy: 'oauth_google',
                // For web, defaults to current path
                // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
                redirectUrl: AuthSession.makeRedirectUri({}),
            });

            // If sign in was successful, set the active session
            if (createdSessionId) {
                await setActive!({ session: createdSessionId });
                // The AuthLayout will handle the redirection based on user role
            } else {
                // If there is no `createdSessionId`,
                // there are missing requirements, such as MFA
                // Use the `signIn` or `signUp` returned from `startSSOFlow`
                // to handle next steps
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }, [isUserLoaded, startSSOFlow])


    return (
        <CustomButton
            text="Google"
            onPress={onPress}
        />
    )
}