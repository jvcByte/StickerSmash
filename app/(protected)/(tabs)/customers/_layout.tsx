import { Stack } from 'expo-router';

export default function CustomersLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Customers' }} />
            <Stack.Screen name="[id]" options={{ title: 'Customer Details' }} />
            <Stack.Screen name="add" options={{ title: 'Add Customer' }} />
        </Stack>
    );
}