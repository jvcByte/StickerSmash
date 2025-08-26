import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';

type ClerkUser = {
    id: string;
    publicMetadata?: {
        role?: string;
    };
};

export default function TabLayout() {
  console.log('Tabs Layout');
  const colorScheme = useColorScheme();

  const { user } = useUser();
  const clerkUser = user as ClerkUser | null | undefined;
  const { isSignedIn } = useAuth();
  const isAdmin = clerkUser?.publicMetadata?.role;
  if(!isSignedIn){
    return <Redirect href="/(auth)/sign-in" />;
  }
  
  if (isSignedIn && isAdmin === 'admin') {
    return <Redirect href="/(protected)/(admin)" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cars"
        options={{
          title: 'Cars',
          tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'car' : 'car-outline'} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
