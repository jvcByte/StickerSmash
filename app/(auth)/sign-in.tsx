import CustomButton from '@/components/ui/CustomButton';
import CustomInput from '@/components/ui/CustomInput';
import { isClerkAPIResponseError, useSignIn, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { z } from 'zod/v3';

import SignInWithGoogle from '@/components/SignInWithGoogle';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { SafeAreaView } from 'react-native-safe-area-context';

type ClerkUser = {
    id: string;
    publicMetadata?: {
        role?: string;
    };
};

const signInSchema = z.object({
    email: z.string({ message: 'Email is required' }).email({ message: 'Invalid email' }),
    password: z.string({ message: 'Password is required' }).min(8, 'Minimum of 8 characters'),
});

type SignInField = z.infer<typeof signInSchema>;

const mapClerkErrorToFormField = (error: any) => {
    switch (error.meta?.paramName) {
        case 'identifier':
            return 'email'
        case 'password':
            return 'password'
        default:
            return 'root'
    }
}

export default function SignInScreen() {

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<SignInField>({
        resolver: zodResolver(signInSchema),
    });
    const { signIn, isLoaded, setActive } = useSignIn();
    const { user } = useUser();
    const clerkUser = user as ClerkUser | null | undefined;
    const role = clerkUser?.publicMetadata?.role;

    console.log('Errors: ', errors)

    const onSignIn = async ({ email, password }: SignInField) => {
        console.log('Sign in: ', { email, password })

        if (!isLoaded) return;

        try {
            const signInResult = await signIn.create({
                identifier: email,
                password: password,
            })

            if (signInResult.status === 'complete') {
                console.log('Sign in complete')
                setActive({ session: signInResult.createdSessionId })
                if (role === 'admin') {
                    router.push('/(protected)/(admin)')
                } else {
                    router.push('/(protected)/(tabs)')
                }
            } else {
                console.log('Sign in not complete: ', signInResult)
            }
        } catch (error) {
            console.log('Error: ', JSON.stringify(error, null, 2))
            if (isClerkAPIResponseError(error)) {
                error.errors.forEach((error) => {
                    const fieldName = mapClerkErrorToFormField(error)
                    setError(fieldName, { message: error.longMessage })
                })
            } else {
                setError('root', { message: 'Something went wrong' })
            }
        }
    }

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <View style={[styles.logoContainer, { backgroundColor: colors.tint + '20' }]}>
                            <Ionicons name="car-sport" size={60} color={colors.tint} />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
                            Sign in to continue to ROA AutoTech
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <CustomInput<SignInField>
                                name='email'
                                control={control}
                                placeholder='Email'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                autoComplete='email'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <CustomInput<SignInField>
                                name='password'
                                control={control}
                                placeholder='Password'
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.forgotPassword}
                            onPress={() => router.push('/forgot-password')}
                        >
                            <Text style={[styles.forgotPasswordText, { color: colors.tint }]}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {errors.root?.message && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="warning" size={18} color="#ff3b30" />
                            <Text style={styles.error}>{errors.root?.message}</Text>
                        </View>
                    )}

                    <CustomButton
                        text='Sign In'
                        onPress={handleSubmit(onSignIn)}
                        style={[styles.signInButton, { backgroundColor: colors.tint }]}
                        textStyle={[styles.signInButtonText, { color: colors.background }]}
                    />

                    <View style={styles.orContainer}>
                        <View style={[styles.orLine, { backgroundColor: colors.border }]} />
                        <Text style={[styles.or, { color: colors.tabIconDefault }]}>or continue with</Text>
                        <View style={[styles.orLine, { backgroundColor: colors.border }]} />
                    </View>

                    <SignInWithGoogle style={[styles.googleButton, {
                        backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.6)'
                    }]} />
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.tabIconDefault }]}>
                            Don&apos;t have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/sign-up')}>
                            <Text style={[styles.signUpText, { color: colors.tint }]}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        paddingTop: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 8,
    },
    form: {
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputIcon: {
        marginRight: 8,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: 8,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '500',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    error: {
        color: '#ff3b30',
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    signInButton: {
        width: '100%',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        marginBottom: 24,
    },
    signInButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    or: {
        fontSize: 14,
        paddingHorizontal: 12,
        zIndex: 1,
        backgroundColor: 'transparent',
    },
    orLine: {
        flex: 1,
        height: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        marginBottom: 16,
    },
    footerText: {
        fontSize: 14,
    },
    signUpText: {
        fontSize: 14,
        fontWeight: '600',
    },
    googleButton: {
        width: '100%',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        marginBottom: 24,
    },
});
