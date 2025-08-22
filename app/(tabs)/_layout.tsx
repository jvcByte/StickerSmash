import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "blue",
                tabBarInactiveTintColor: "gray",
                headerTintColor: "#fff",
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: "blue",
                },
                tabBarStyle: {
                    backgroundColor: "white",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: "Home",
                    tabBarIcon: ({ focused, size }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={focused ? "blue" : "gray"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    headerTitle: "About",
                    tabBarIcon: ({ focused, size }) => (
                        <Ionicons
                            name={focused ? "information-circle" : "information-circle-outline"}
                            size={size}
                            color={focused ? "blue" : "gray"}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}