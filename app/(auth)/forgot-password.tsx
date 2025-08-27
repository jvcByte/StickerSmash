import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CustomButton from '@/components/ui/CustomButton';
import CustomInput from '@/components/ui/CustomInput';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordField = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
    console.log('Forgot Password Screen');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useSignIn();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const {
        control,
        handleSubmit,
    } = useForm<ForgotPasswordField>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const handleResetPassword = async (data: ForgotPasswordField) => {
        if (!signIn) return;

        setIsLoading(true);
        try {
            // Initiate password reset
            const { supportedFirstFactors } = await signIn.create({
                identifier: data.email,
            }) as { supportedFirstFactors: any[] };

            if (!supportedFirstFactors) {
                throw new Error('Could not initiate password reset');
            }

            // Find the email factor
            const emailFactor = supportedFirstFactors.find(
                (factor) => factor.strategy === 'reset_password_email_code'
            ) as any;

            if (!emailFactor) {
                throw new Error('Email factor not found');
            }

            // Store email for verification
            await signIn.prepareFirstFactor({
                strategy: 'reset_password_email_code',
                emailAddressId: emailFactor.emailAddressId,
            });

            // Navigate to reset password screen with email
            router.push({
                pathname: '/(auth)/reset-password',
                params: { email: data.email }
            });
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            Alert.alert(
                'Error',
                err.errors?.[0]?.longMessage || 'An error occurred while sending the reset email.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToSignIn = () => {
        router.back();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ThemedView style={styles.container}>
                <TouchableOpacity onPress={handleBackToSignIn} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.tint} />
                </TouchableOpacity>

                <View style={styles.content}>
                    <ThemedText type="title" style={styles.title}>
                        Forgot Password
                    </ThemedText>

                    <ThemedText style={[styles.subtitle, { marginBottom: 32 }]}>
                        Enter your email and we&apos;ll send you a link to reset your password
                    </ThemedText>

                    <CustomInput
                        control={control}
                        name="email"
                        placeholder="Email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        leftIcon={
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={colors.tabIconDefault}
                                style={styles.inputIcon}
                            />
                        }
                        style={[styles.input, { color: colors.text }]}
                        placeholderTextColor={colors.tabIconDefault + '80'}
                    />

                    <TouchableOpacity>
                        {isLoading ? (
                            <ActivityIndicator style={[styles.button, {
                                backgroundColor: colors.tint,
                                padding: 12,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }]}
                                color={colors.background}
                            />
                        ) : (
                            <CustomButton
                                text='Send Reset Link'
                                onPress={handleSubmit(handleResetPassword)}
                                disabled={isLoading}
                                style={[styles.button, { backgroundColor: colors.tint }]}
                                textStyle={[styles.buttonText, { color: colors.background }]}
                            />
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <ThemedText style={styles.rememberPassword}>
                            Remember your password?{' '}
                        </ThemedText>
                        <TouchableOpacity onPress={handleBackToSignIn}>
                            <ThemedText style={[styles.signInLink, { color: colors.tint }]}>
                                Sign In
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ThemedView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.8,
        marginBottom: 8,
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 50,
        width: '100%',
    },
    input: {
        flex: 1,
        height: '100%',
        marginLeft: 8,
        fontSize: 16,
    },
    inputIcon: {
        marginRight: 8,
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        marginTop: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    rememberPassword: {
        opacity: 0.7,
    },
    signInLink: {
        fontWeight: '600',
    },
    successContainer: {
        alignItems: 'center',
        width: '100%',
    },
    successIcon: {
        marginBottom: 24,
    },
    helperText: {
        opacity: 0.7,
        fontSize: 14,
        marginTop: 8,
    },
});