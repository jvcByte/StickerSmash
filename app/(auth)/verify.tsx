import { 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  Alert, 
  View, 
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Clipboard
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn, useSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { router, useLocalSearchParams } from 'expo-router';
import CustomButton from '@/components/ui/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useState, useEffect, useRef } from 'react';

const verificationSchema = z.object({
    code: z.string().length(6, { message: 'Verification code must be 6 digits' }),
});

type VerificationField = z.infer<typeof verificationSchema>;

export default function VerifyScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { email } = useLocalSearchParams<{ email: string }>();
    const { signIn, isLoaded: isSignInLoaded } = useSignIn();
    const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30);
    const [isVerifying, setIsVerifying] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [digits, setDigits] = useState(Array(6).fill(''));
    const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));

    // Get email from params or signUp state
    useEffect(() => {
        if (email) {
            setEmailAddress(email);
        } else if (signUp?.emailAddress) {
            setEmailAddress(signUp.emailAddress);
        }
    }, [email, signUp?.emailAddress]);

    const { handleSubmit, formState: { errors }, setError, setValue } = useForm<VerificationField>({
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

    const handleDigitChange = (text: string, index: number) => {
        // Only handle paste on the first input to avoid multiple triggers
        if (text.length > 1 && index === 0) {
            const code = text.replace(/\D/g, ''); // Remove non-digits
            if (code.length === 6) {
                const newDigits = [...digits];
                for (let i = 0; i < 6; i++) {
                    newDigits[i] = code[i] || '';
                }
                setDigits(newDigits);
                setValue('code', newDigits.join(''));
                inputRefs.current[5]?.focus();
            }
            return;
        }
        
        // Regular single digit input
        const newDigits = [...digits];
        newDigits[index] = text;
        setDigits(newDigits);
        setValue('code', newDigits.join(''));
        
        // Move to next input or submit if last digit
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        } else if (index === 5 && text) {
            handleSubmit(handleVerification)();
        }
    };
    
    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        // Handle backspace
        if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
            const newDigits = [...digits];
            newDigits[index - 1] = '';
            setDigits(newDigits);
            setValue('code', newDigits.join(''));
            inputRefs.current[index - 1]?.focus();
        }
    };
    
    const handleVerification = async (data: VerificationField) => {
        if (!isSignInLoaded && !isSignUpLoaded) return;
        
        setIsVerifying(true);
        
        try {
            // Try to complete sign up first
            if (signUp) {
                const completeSignUp = await signUp.attemptEmailAddressVerification({
                    code: data.code,
                });
                
                if (completeSignUp.status === 'complete') {
                    router.replace('/(protected)/(tabs)');
                    return;
                }
            }
            
            // If no sign up or sign up is already complete, try sign in
            if (isSignInLoaded) {
                const result = await signIn.attemptFirstFactor({
                    strategy: 'email_code',
                    code: data.code,
                });
                
                if (result.status === 'complete') {
                    router.replace('/(protected)/(tabs)');
                }
            }
        } catch (err) {
            console.log(JSON.stringify(err, null, 2));
            
            if (isClerkAPIResponseError(err)) {
                setError('code', {
                    type: 'manual',
                    message: err.errors[0]?.longMessage || err.errors[0]?.message,
                });
            } else {
                setError('code', {
                    type: 'manual',
                    message: 'An error occurred. Please try again.'
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
                        <ThemedText style={[styles.label, { color: colors.tabIconDefault }]}>
                            Verification Code
                        </ThemedText>
                        <View style={styles.digitsContainer}>
                            {digits.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={el => { if (el) inputRefs.current[index] = el }}
                                    style={[
                                        styles.digitInput,
                                        errors.code && styles.digitInputError,
                                        { borderColor: colors.tabIconDefault + '50' }
                                    ]}
                                    value={digit}
                                    onChangeText={(text) => handleDigitChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    onFocus={async () => {
                                        // Only trigger paste on first input when empty
                                        if (index === 0 && !digits.some(d => d)) {
                                            const text = await Clipboard.getString();
                                            const code = text.replace(/\D/g, '');
                                            if (code.length === 6) {
                                                handleDigitChange(code, 0);
                                            }
                                        }
                                    }}
                                    keyboardType="number-pad"
                                    maxLength={6} // Allow pasting longer text
                                    selectTextOnFocus
                                    editable={!isVerifying}
                                    contextMenuHidden={false}
                                />
                            ))}
                        </View>
                        {errors.code?.message && (
                            <ThemedText style={styles.errorText}>
                                {errors.code.message}
                            </ThemedText>
                        )}
                    </ThemedView>

                    <CustomButton
                        text={isVerifying ? 'Verifying...' : 'Verify Email'}
                        onPress={handleSubmit(handleVerification)}
                        loading={isVerifying}
                        style={[styles.verifyButton, { backgroundColor: colors.tint }]}
                        textStyle={[styles.verifyButtonText, { color: colors.background }]}
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
    label: {
        fontSize: 14,
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    digitsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 4,
    },
    digitInput: {
        width: 44,
        height: 60,
        borderWidth: 1,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: 'white',
    },
    digitInputError: {
        borderColor: '#ff3b30',
        backgroundColor: 'rgba(255, 59, 48, 0.05)',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 12,
        marginTop: 4,
        alignSelf: 'flex-start',
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
        marginLeft: 4,
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
    verifyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
