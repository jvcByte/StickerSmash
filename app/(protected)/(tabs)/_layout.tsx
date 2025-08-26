import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { NotificationBadge } from '@/components/NotificationBadge';

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

  // Sample notification counts - in a real app, these would come from your state/context
  const notificationCounts = {
    dashboard: 0,  // No notifications for dashboard
    cars: 3,       // 3 new car-related notifications
    profile: 1     // 1 notification in profile
  };

  // Helper function to render tab bar icon with notification badge
  const renderTabBarIcon = (name: string, focused: boolean, iconName: string, count: number) => {
    const iconFilled = iconName as keyof typeof Ionicons.glyphMap;
    const iconOutline = `${iconName}-outline` as keyof typeof Ionicons.glyphMap;
    
    return (
      <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons 
          name={focused ? iconFilled : iconOutline} 
          size={24} 
          color={focused ? Colors[colorScheme ?? 'light'].tint : '#8E8E93'} 
        />
        {count > 0 && <NotificationBadge count={count} size={18} />}
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#8E8E93',
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          shadowColor: Colors[colorScheme ?? 'light'].background,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        headerTitleStyle: {
          color: Colors[colorScheme ?? 'light'].text,
          fontWeight: 'bold',
        },
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            borderTopWidth: 0,
            borderTopColor: 'transparent',
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -4,
          marginBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => 
            renderTabBarIcon('dashboard', focused, 'speedometer', notificationCounts.dashboard),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Service',
          tabBarIcon: ({ color, size, focused }) => 
            renderTabBarIcon('cars', focused, 'car-sport', notificationCounts.cars),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => 
            renderTabBarIcon('profile', focused, 'person', notificationCounts.profile),
        }}
      />
      <Tabs.Screen
        name='payments'
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name='support'
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name='documents'
        options={{
          href: null
        }}
      />
    </Tabs>
  );
}
