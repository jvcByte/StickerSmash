import {
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import CustomInput from '@/components/ui/CustomInput';
import CustomButton from '@/components/ui/CustomButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { router } from 'expo-router';

const verifySchema = z.object({
    code: z.string({ message: 'Code is required' }).min(6, 'Minimum of 6 characters'),
});

type VerifyField = z.infer<typeof verifySchema>;

const mapClerkErrorToFormField = (error: any) => {
    switch (error.meta?.paramName) {
        case 'code':
            return 'code'
        default:
            return 'root'
    }
}

export default function VerifyScreen() {

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<VerifyField>({
        resolver: zodResolver(verifySchema),
    });

    const { signUp, isLoaded, setActive } = useSignUp();

    console.log('Errors: ', errors)

    const onVerify = async (data: VerifyField) => {
        console.log('Verify: ', data)

        if (!isLoaded) return;

        try {
            const signUpResult = await signUp.attemptVerification({
                strategy: 'email_code',
                code: data.code,
            })
            if (signUpResult.status === 'complete') {
                console.log('Sign up complete')
                setActive({ session: signUpResult.createdSessionId })
                router.push('/(protected)/(tabs)')
            } else {
                console.log('Sign up not complete: ', signUpResult)
                setError('root', { message: 'Could not verify code. Please try again' })
            }
        } catch (error) {
            console.log('Error: ', error);
            if (isClerkAPIResponseError(error)) {
                error.errors.forEach((error) => {
                    console.log('Clerk API Error: ', JSON.stringify(error, null, 2))
                    const fieldName = mapClerkErrorToFormField(error)
                    setError(fieldName, { message: error.longMessage })
                })
            } else {
                setError('root', { message: 'Something went wrong' })
            }
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

            <Text style={styles.title}>Verify your account</Text>

            <CustomInput
                name='code'
                control={control}
                placeholder='Enter code (Eg. 123456)'
                autoCapitalize='none'
                keyboardType='numeric'
                autoComplete='one-time-code'
            />

            {errors.root?.message && (
                <Text style={styles.error}>{errors.root?.message}</Text>
            )}

            <CustomButton
                text='Verify'
                onPress={handleSubmit(onVerify)}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 20,
        gap: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    error: {
        color: 'crimson',
        fontSize: 12,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'crimson',
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
});
