import { StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn, useSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { router, useLocalSearchParams } from 'expo-router';
import CustomInput from '@/components/ui/CustomInput';
import CustomButton from '@/components/ui/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useState, useEffect } from 'react';

const verificationSchema = z.object({
    code: z.string().length(6, { message: 'Verification code must be 6 digits' }),
});

type VerificationField = z.infer<typeof verificationSchema>;

export default function VerifyScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { email } = useLocalSearchParams<{ email: string }>();
    const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
    const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30);
    const [isVerifying, setIsVerifying] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');

    // Get email from params or signUp state
    useEffect(() => {
        if (email) {
            setEmailAddress(email);
        } else if (signUp?.emailAddress) {
            setEmailAddress(signUp.emailAddress);
        }
    }, [email, signUp?.emailAddress]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<VerificationField>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            code: '',
        },
    });

    // Handle resend cooldown
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [resendCooldown]);

    const handleVerification = async (data: VerificationField) => {
        if (!isSignInLoaded || !isSignUpLoaded) return;
        setIsVerifying(true);

        try {
            // Try to complete sign up first
            if (signUp) {
                const completeSignUp = await signUp.attemptEmailAddressVerification({
                    code: data.code,
                });

                if (completeSignUp.status === 'complete') {
                    await setSignUpActive({ session: completeSignUp.createdSessionId });
                    router.replace('/(protected)/(tabs)');
                    return;
                }
            }

            // If not signing up, try to verify sign in
            if (signIn) {
                const completeSignIn = await signIn.attemptFirstFactor({
                    strategy: 'email_code',
                    code: data.code,
                });

                if (completeSignIn.status === 'complete') {
                    await setActive({ session: completeSignIn.createdSessionId });
                    router.replace('/(protected)/(tabs)');
                    return;
                }
            }

            // If we get here, verification failed
            setError('code', {
                type: 'manual',
                message: 'Invalid verification code. Please try again.',
            });
        } catch (err) {
            console.log(JSON.stringify(err, null, 2));
            
            if (isClerkAPIResponseError(err)) {
                setError('code', {
                    type: 'manual',
                    message: err.errors?.[0]?.longMessage || 'Verification failed. Please try again.',
                });
            } else {
                setError('code', {
                    type: 'manual',
                    message: 'An error occurred during verification. Please try again.',
                });
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if ((!isSignUpLoaded && !isSignInLoaded) || resendCooldown > 0) return;
        
        setIsResending(true);
        
        try {
            if (signUp) {
                await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            } else if (signIn && emailAddress) {
                await signIn.create({ 
                    identifier: emailAddress,
                    strategy: 'email_code'
                });
            } else {
                throw new Error('No sign-up or sign-in context available');
            }
            
            Alert.alert('Success', `A new verification code has been sent to ${emailAddress || 'your email'}.`);
            setResendCooldown(30);
        } catch (err) {
            console.error('Error resending code:', err);
            Alert.alert(
                'Error', 
                err instanceof Error 
                    ? err.message 
                    : 'Failed to resend verification code. Please try again.'
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ThemedView style={styles.logoContainer}>
                    <Ionicons name="shield-checkmark" size={60} color={colors.tint} />
                    <ThemedText style={[styles.title, { color: colors.text }]}>
                        Verify Your Email
                    </ThemedText>
                    <ThemedText style={[styles.subtitle, { color: colors.tabIconDefault }]}>
                        We&apos;ve sent a 6-digit code to
                    </ThemedText>
                    <ThemedText style={[styles.emailText, { color: colors.tint }]}>
                        {emailAddress || 'your email address'}
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.formContainer}>
                    <ThemedView style={styles.codeInputContainer}>
                      <CustomInput
                          control={control}
                          name="code"
                          label="Verification Code"
                          placeholder="Enter 6-digit code"
                          keyboardType="number-pad"
                          maxLength={6}
                          error={errors.code?.message}
                          style={styles.codeInput}
                      />
                    </ThemedView>

                    <CustomButton
                        text={isVerifying ? 'Verifying...' : 'Verify Email'}
                        onPress={handleSubmit(handleVerification)}
                        loading={isVerifying}
                        style={styles.verifyButton}
                    />

                    <ThemedView style={styles.resendContainer}>
                        <ThemedText style={[styles.resendText, { color: colors.tabIconDefault }]}>
                            Didn&apos;t receive a code? 
                        </ThemedText>
                        <TouchableOpacity 
                            onPress={handleResendCode} 
                            disabled={isResending || resendCooldown > 0}
                        >
                            <ThemedText 
                                style={[
                                    styles.resendLink, 
                                    { 
                                        color: (isResending || resendCooldown > 0) 
                                            ? colors.tabIconDefault 
                                            : colors.tint 
                                    }
                                ]}
                            >
                                {isResending 
                                    ? 'Sending...' 
                                    : resendCooldown > 0 
                                        ? `Resend in ${resendCooldown}s` 
                                        : 'Resend Code'}
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons 
                            name="arrow-back" 
                            size={20} 
                            color={colors.tabIconDefault} 
                            style={styles.backIcon}
                        />
                        <ThemedText style={[styles.backText, { color: colors.tabIconDefault }]}>
                            Back to {signUp ? 'Sign Up' : 'Sign In'}
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 4,
    },
    emailText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    codeInputContainer: {
        width: '100%',
        marginBottom: 30,
    },
    codeInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        textAlign: 'center',
        letterSpacing: 5,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'white',
        minHeight: 40,
    },
    verifyButton: {
        marginTop: 10,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    resendText: {
        fontSize: 14,
    },
    resendLink: {
        fontSize: 14,
        fontWeight: '600',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    backIcon: {
        marginRight: 6,
    },
    backText: {
        fontSize: 14,
    },
});
