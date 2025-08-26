import { Stack } from 'expo-router';

export default function RepairsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Repairs' }} />
            <Stack.Screen name="[id]" options={{ title: 'Repair Details' }} />
            <Stack.Screen name="add" options={{ title: 'Add Repair' }} />
        </Stack>
    );
}