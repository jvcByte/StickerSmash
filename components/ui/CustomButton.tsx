import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, PressableProps } from "react-native";

type CustomButtonProps = {
    text: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
} & PressableProps;


export default function CustomButton({
    text,
    style,
    textStyle,
    ...props
}: CustomButtonProps) {
    return (
        <Pressable
            {...props}
            style={[styles.button, style]}
        >
            <Text
                style={[styles.buttonText, textStyle]}
            >
                {text}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4353fd',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

