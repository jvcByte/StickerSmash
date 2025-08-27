import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CustomButton from '@/components/ui/CustomButton';
import CustomInput from '@/components/ui/CustomInput';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TextInput as RNTextInput,
    StyleSheet,
    TouchableOpacity,
    View,
    type NativeSyntheticEvent,
    type TextInputKeyPressEventData
} from 'react-native';
import { z } from 'zod';

const resetPasswordSchema = z.object({
    code: z.string().length(6, { message: 'Verification code must be 6 digits' }),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordField = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
    console.log('Reset Password Screen');
    const { email } = useLocalSearchParams<{ email: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30);
    const [digits, setDigits] = useState<string[]>(new Array(6).fill(''));
    const { signIn, isLoaded, setActive } = useSignIn();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const inputRefs = useRef<(RNTextInput | null)[]>(Array(6).fill(null));

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ResetPasswordField>({
        resolver: zodResolver(resetPasswordSchema),
    });

    // Handle paste functionality
    const handlePaste = (text: string) => {
        const code = text.replace(/[^0-9]/g, '').substring(0, 6);
        if (code.length === 6) {
            const newDigits = [...digits];
            for (let i = 0; i < 6; i++) {
                newDigits[i] = code[i] || '';
            }
            setDigits(newDigits);
            setValue('code', newDigits.join(''));
            // Focus the last input
            const lastInput = inputRefs.current[5];
            if (lastInput) {
                lastInput.focus();
            }
        }
    };

    // Handle digit input
    const handleDigitChange = (text: string, index: number) => {
        // Handle paste
        if (text.length > 1) {
            handlePaste(text);
            return;
        }

        // Regular input
        const newDigits = [...digits];
        newDigits[index] = text;
        setDigits(newDigits);
        setValue('code', newDigits.join(''));

        // Move to next input
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
            const newDigits = [...digits];
            newDigits[index - 1] = '';
            setDigits(newDigits);
            setValue('code', newDigits.join(''));
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle password reset
    const handleResetPassword = async (data: ResetPasswordField) => {
        if (!signIn) return;

        setIsLoading(true);
        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: data.code,
                password: data.password,
            });

            if (result.status === 'complete') {
                Alert.alert('Success', 'Your password has been reset successfully!');
                setActive({ session: result.createdSessionId });
                router.replace('/(protected)/(tabs)');
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            Alert.alert(
                'Error',
                err.errors?.[0]?.longMessage || 'An error occurred while resetting your password.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle resend code
    const handleResendCode = async () => {
        if (!signIn || !email || resendCooldown > 0) return;

        try {
            const { supportedFirstFactors } = await signIn.create({
                identifier: email,
            }) as { supportedFirstFactors: any[] };

            const emailFactor = supportedFirstFactors.find(
                (factor) => factor.strategy === 'reset_password_email_code'
            ) as any;

            if (emailFactor) {
                await signIn.prepareFirstFactor({
                    strategy: 'reset_password_email_code',
                    emailAddressId: emailFactor.emailAddressId,
                });

                // Start cooldown
                setResendCooldown(30);
                const timer = setInterval(() => {
                    setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
                    if (resendCooldown <= 0) {
                        clearInterval(timer);
                    }
                }, 1000);

                Alert.alert('Success', 'A new verification code has been sent to your email.');
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            Alert.alert(
                'Error',
                err.errors?.[0]?.longMessage || 'Failed to resend verification code.'
            );
        }
    };

    if (!isLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <ThemedView style={styles.innerContainer}>
                <ThemedText style={[styles.title, { color: colors.text }]}>
                    Reset Password
                </ThemedText>

                <ThemedText style={[styles.subtitle, { color: colors.tabIconDefault, marginBottom: 32 }]}>
                    Enter the 6-digit code sent to {email} and your new password
                </ThemedText>

                <View style={styles.codeContainer}>
                    {digits.map((digit, index) => (
                        <RNTextInput
                            key={index}
                            ref={(el) => {
                                if (el) {
                                    inputRefs.current[index] = el;
                                }
                            }}
                            style={[
                                styles.codeInput,
                                {
                                    borderColor: errors.code ? 'red' : colors.tint,
                                    color: colors.text,
                                    backgroundColor: colors.background,
                                },
                            ]}
                            value={digit}
                            onChangeText={(text) => handleDigitChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={index === 0 ? 6 : 1}
                            selectTextOnFocus
                            textContentType="oneTimeCode"
                        />
                    ))}
                </View>
                {errors.code ? (
                    <ThemedText style={[styles.errorText, { color: 'red' }]}>
                        {errors.code.message}
                    </ThemedText>
                ) : <ThemedText style={{ marginTop: -20, marginBottom: 12, fontSize: 12 }}></ThemedText>}

                <CustomInput<ResetPasswordField>
                    name="password"
                    control={control}
                    placeholder="New Password"
                    secureTextEntry
                    autoCapitalize="words"
                    leftIcon={
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color={colors.tabIconDefault}
                            style={styles.inputIcon}
                        />
                    }
                    style={[styles.input, { color: colors.text }]}
                    placeholderTextColor={colors.tabIconDefault + '80'}
                />

                <CustomInput
                    control={control}
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    secureTextEntry
                    autoCapitalize="words"
                    leftIcon={
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color={colors.tabIconDefault}
                            style={styles.inputIcon}
                        />
                    }
                    style={[styles.input, { color: colors.text }]}
                    placeholderTextColor={colors.tabIconDefault + '80'}
                />

                <View style={styles.buttonContainer}>
                    <CustomButton
                        text={isLoading ? 'Resetting...' : 'Reset Password'}
                        onPress={handleSubmit(handleResetPassword)}
                        disabled={isLoading}
                        style={[styles.button, { backgroundColor: colors.tint }]}
                        textStyle={[styles.buttonText, { color: colors.background }]}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleResendCode}
                    disabled={resendCooldown > 0}
                    style={styles.resendContainer}
                >
                    <ThemedText style={[styles.resendText, { color: colors.tint }]}>
                        {resendCooldown > 0
                            ? `Resend code in ${resendCooldown}s`
                            : "Didn't receive a code? Resend"}
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    codeInput: {
        width: 50,
        height: 60,
        borderRadius: 8,
        borderWidth: 1,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 16,
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 50,
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
        marginTop: -20,
        marginBottom: 12,
        fontSize: 12,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 8,
    },
    button: {
        width: '100%',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    resendContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    resendText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
