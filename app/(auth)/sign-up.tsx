import {
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    Platform,
    View,
} from 'react-native';
import CustomInput from '@/components/ui/CustomInput';
import CustomButton from '@/components/ui/CustomButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthNav from '@/components/AuthNav';
import { useSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { router } from 'expo-router';

const signUpSchema = z.object({
    email: z.string({ message: 'Email is required' }).email({ message: 'Invalid email' }),
    password: z.string({ message: 'Password is required' }).min(8, 'Minimum of 8 characters'),
});

type SignUpField = z.infer<typeof signUpSchema>;

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

    const onSignUp = async ({email, password}: SignUpField) => {
        console.log('Sign up: ', {email, password})

        if (!isLoaded) return;

        try {
            await signUp.create({
                emailAddress: email,
                password: password,
            })
            await signUp.prepareVerification({
                strategy: 'email_code',
            })
            router.push('/verify');
        } catch (err) {
            console.log('Sign up Error: ', err);
            if (isClerkAPIResponseError(err)) {
                console.log('Clerk API Error: ', JSON.stringify(err.errors, null, 2))
                err.errors.forEach((error) => {
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

            <Text style={styles.title}>Create an account</Text>

            <View style={styles.form} >
                <CustomInput
                    name='email'
                    control={control}
                    placeholder='Email'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    autoComplete='email'
                />
                <CustomInput
                    name='password'
                    control={control}
                    placeholder='Password'
                    secureTextEntry
                />
            </View>
            {errors.root?.message && (
                <Text style={styles.error}>{errors.root?.message}</Text>
            )}

            <CustomButton
                text='Sign up'
                onPress={handleSubmit(onSignUp)}
            />

            <AuthNav title={'Already have an account?'} text={'Sign in'} href={'/sign-in'} />
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

    form: {
        gap: 4,
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
