import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function RepairsLayout() {
    const colorScheme = useColorScheme();
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
                headerTitleStyle: {
                    color: Colors[colorScheme ?? 'light'].text,
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Services' }} />
            <Stack.Screen name="[id]" options={{ title: 'Service Details' }} />
            <Stack.Screen name="history" options={{ title: 'Service History' }} />
            <Stack.Screen name="schedule" options={{ title: 'Service Schedule' }} />
            <Stack.Screen name="upcoming" options={{ title: 'Upcoming Services' }} />
        </Stack>
    );
}