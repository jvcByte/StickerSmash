import { Stack } from 'expo-router';

export default function HistoryLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'History' }} />
        </Stack>
    );
}