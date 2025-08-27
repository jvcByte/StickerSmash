import { StyleSheet, TextInput, TextInputProps, Text, View } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type CustomInputProps<T extends FieldValues> = {
    control: Control<T>;
    label?: string;
    name: Path<T>;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: string;
    loading?: boolean;
} & TextInputProps;

export default function CustomInput<T extends FieldValues>({control, label, name, leftIcon, rightIcon, ...props}: CustomInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({
                field: { value, onChange, onBlur },
                fieldState: { error }
            }) => (
                <View style={styles.container}>
                    {label && <Text style={styles.label}>{label}</Text>}
                    {leftIcon}
                    <TextInput
                        {...props}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        style={[
                            styles.input,
                            props.style,
                            error && styles.inputError
                        ]}
                    />
                    {<Text style={styles.errorText}>{error?.message}</Text>}
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
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
});
