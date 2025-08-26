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
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import SignInWith from '@/components/SignInWith';
import AuthNav from '@/components/AuthNav';

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
                router.push('/(protected)/(tabs)')
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

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

            <Text style={styles.title}>Sign in</Text>

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
                text='Sign in'
                onPress={handleSubmit(onSignIn)}
            />
            <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <Text style={styles.or}>Or</Text>
                <View style={styles.orLine} />
            </View>
            <SignInWith />  

            <AuthNav title={'Don\'t have an account?'} text={'Sign up'} href={'/sign-up'} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 25,
        gap: 8,
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

    or: {
        textAlign: 'center',
        paddingHorizontal: 12,
        color: '#666',
        backgroundColor: 'white',
        zIndex: 1,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    orLine: {
        flex: 1,
        height: 1.5,
        backgroundColor: '#ddd',
    },
});
