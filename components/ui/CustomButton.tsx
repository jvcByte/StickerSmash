import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, PressableProps } from "react-native";

type CustomButtonProps = {
    text: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    loading?: boolean;
    variant?: 'solid' | 'outline' | 'primary' | 'secondary';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
} & PressableProps;


export default function CustomButton({
    text,
    style,
    textStyle,
    loading,
    variant = 'outline',
    leftIcon,
    rightIcon,
    ...props
}: CustomButtonProps) {
    return (
        <Pressable
            {...props}
            style={[styles.button, style]}
        >
            {leftIcon}
            <Text
                style={[styles.buttonText, textStyle]}
            >
                {loading ? 'Loading...' : text}
            </Text>
            {rightIcon}
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

