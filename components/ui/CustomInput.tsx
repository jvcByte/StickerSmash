import { StyleSheet, TextInput, TextInputProps, Text, View } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type CustomInputProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
} & TextInputProps;

export default function CustomInput<T extends FieldValues>({control, name, ...props}: CustomInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({
                field: { value, onChange, onBlur },
                fieldState: { error }
            }) => (
                <View style={styles.container}>
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
});
