import {
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    Platform,
    View,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import CustomInput from '@/components/ui/CustomInput';
import CustomButton from '@/components/ui/CustomButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import SignInWithGoogle from '@/components/SignInWithGoogle';
import { SafeAreaView } from 'react-native-safe-area-context';

const signUpSchema = z.object({
    email: z.string({ message: 'Email is required' }).email({ message: 'Please enter a valid email' }),
    password: z
        .string({ message: 'Password is required' })
        .min(6, 'Password must be at least 6 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            'Must contain uppercase, lowercase, number & special character'
        ),
    confirmPassword: z.string({ message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignUpField = z.infer<typeof signUpSchema> & { root?: { message: string } };

const mapClerkErrorToFormField = (error: any) => {
    switch (error.meta?.paramName) {
        case 'email_address':
            return 'email'
        case 'password':
            return 'password'
        default:
            return 'root'
    }
}

export default function SignUpScreen() {

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<SignUpField>({
        resolver: zodResolver(signUpSchema),
    });

    const { signUp, isLoaded } = useSignUp();

    console.log('Errors: ', errors)

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const onSignUp = async ({ email, password }: SignUpField) => {
        if (!isLoaded) return;

        try {
            await signUp.create({
                emailAddress: email,
                password: password,
            });
            await signUp.prepareVerification({
                strategy: 'email_code',
            });
            router.push('/verify');
        } catch (err) {
            console.log('Sign up Error: ', err);
            if (isClerkAPIResponseError(err)) {
                console.log('Clerk API Error: ', JSON.stringify(err.errors, null, 2));
                err.errors.forEach((error) => {
                    const fieldName = mapClerkErrorToFormField(error);
                    setError(fieldName, { message: error.longMessage });
                });
            } else {
                setError('root', { message: 'Something went wrong. Please try again.' });
            }
        }
    }

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
                        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
                            Join ROA AutoTech today
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <CustomInput<SignUpField>
                                name='email'
                                control={control}
                                placeholder='Email'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                autoComplete='email'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <CustomInput<SignUpField>
                                name='password'
                                control={control}
                                placeholder='Password'
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <CustomInput<SignUpField>
                                name='confirmPassword'
                                control={control}
                                placeholder='Confirm Password'
                                secureTextEntry
                            />
                        </View>

                        {errors.root?.message && (
                            <View style={styles.errorContainer}>
                                <Ionicons name="warning" size={18} color="#ff3b30" />
                                <Text style={styles.error}>{errors.root?.message}</Text>
                            </View>
                        )}
                    </View>

                    <CustomButton
                        text='Create Account'
                        onPress={handleSubmit(onSignUp)}
                        style={[styles.signUpButton, { backgroundColor: colors.tint }]}
                        textStyle={[styles.signUpButtonText, { color: colors.background }]}
                    />

                    <View style={styles.orContainer}>
                        <View style={[styles.orLine, { backgroundColor: colors.border }]} />
                        <Text style={[styles.or, { color: colors.tabIconDefault }]}>or sign up with</Text>
                        <View style={[styles.orLine, { backgroundColor: colors.border }]} />
                    </View>
                    
                    <SignInWithGoogle style={[styles.googleButton, { 
                        backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.6)' 
                    }]} />

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.tabIconDefault }]}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/sign-in')}>
                            <Text style={[styles.signInText, { color: colors.tint }]}>Sign in</Text>
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
        color: '#666',
    },
    form: {
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    error: {
        color: '#ff3b30',
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    signUpButton: {
        width: '100%',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        marginBottom: 24,
    },
    signUpButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
    },
    googleButton: {
        width: '100%',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        marginBottom: 24,
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
        marginTop: 8,
        marginBottom: 16,
    },
    footerText: {
        fontSize: 14,
    },
    signInText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
