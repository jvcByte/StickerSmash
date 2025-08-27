import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type CustomInputProps<T extends FieldValues> = {
    control: Control<T>;
    label?: string;
    name: Path<T>;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    secureTextEntry?: boolean;
    error?: string;
    loading?: boolean;
} & TextInputProps;

export default function CustomInput<T extends FieldValues>({
    control,
    label,
    name,
    leftIcon,
    rightIcon,
    secureTextEntry: initialSecureTextEntry = false,
    ...props
}: CustomInputProps<T>) {
    const [secureTextEntry, setSecureTextEntry] = useState(initialSecureTextEntry);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };
    return (
        <Controller
            control={control}
            name={name}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error }
            }) => (
                <View style={styles.container}>
                    <View style={[
                        styles.inputWrapper,
                        { borderColor: colors.tabIconDefault + '50' },
                        error && styles.inputError
                    ]}>
                        {leftIcon}
                        <TextInput
                            {...props}
                            ref={ref}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry={secureTextEntry}
                            style={[
                                styles.input,
                                { color: colors.text },
                                props.style,
                            ]}
                        />
                        {initialSecureTextEntry && (
                            <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
                                <Ionicons
                                    name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={colors.tabIconDefault}
                                />
                            </TouchableOpacity>
                        )}
                        {rightIcon}
                    </View>
                    {error && <Text style={[styles.errorText, { color: 'red' }]}>{error.message}</Text>}
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 2,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        height: '100%',
        marginLeft: 8,
        fontSize: 16,
    },
    errorText: {
        color: 'crimson',
        fontSize: 12,
        marginTop: 2,
    },
    inputError: {
        borderColor: 'crimson',
        borderWidth: 1,
    },
    label: {
        fontSize: 12,
        color: '#666',
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
    inputIcon: {
        marginRight: 8,
    },
    eyeIcon: {
        padding: 8,
    },
    // inputBorderLeftError: {
    //     borderLeftColor: 'crimson',
    //     borderLeftWidth: 1,
    // },
});
