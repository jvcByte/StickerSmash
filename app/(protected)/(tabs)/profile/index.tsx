import { StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <ThemedView style={styles.header}>
          <ThemedView style={styles.avatarContainer}>
            {user?.imageUrl ? (
              <Image 
                source={{ uri: user.imageUrl }} 
                style={styles.avatar}
              />
            ) : (
              <Ionicons name="person-circle" size={80} color="#4a90e2" />
            )}
            <ThemedView style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </ThemedView>
          </ThemedView>
          
          <ThemedText type="title" style={styles.name}>
            {user?.fullName || 'User'}
          </ThemedText>
          <ThemedText style={styles.email}>
            {user?.primaryEmailAddress?.emailAddress}
          </ThemedText>
        </ThemedView>

        {/* Account Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Account
          </ThemedText>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color="#4a90e2" />
            <ThemedText style={styles.menuText}>Edit Profile</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="lock-closed-outline" size={24} color="#4a90e2" />
            <ThemedText style={styles.menuText}>Change Password</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color="#4a90e2" />
            <ThemedText style={styles.menuText}>Notifications</ThemedText>
            <ThemedView style={styles.badge}>
              <ThemedText style={styles.badgeText}>3</ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </ThemedView>

        {/* App Settings */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            App Settings
          </ThemedText>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="moon-outline" size={24} color="#4a90e2" />
            <ThemedText style={styles.menuText}>Dark Mode</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="language-outline" size={24} color="#4a90e2" />
            <ThemedText style={styles.menuText}>Language</ThemedText>
            <ThemedText style={styles.languageText}>English</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </ThemedView>

        {/* Support & About */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Support & About
          </ThemedText>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#4a90e2" />
            <ThemedText style={styles.menuText}>Help & Support</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={24} color="#4a90e2" />
            <ThemedText style={styles.menuText}>About App</ThemedText>
            <ThemedText style={styles.versionText}>v1.0.0</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </ThemedView>

        {/* Sign Out Button */}
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <ThemedText style={[styles.menuText, { color: '#FF3B30' }]}>
            Sign Out
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.copyright}>
          © 2025 AutoMech. All rights reserved.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF10',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
  },
  sectionTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 2,
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  languageText: {
    color: '#8E8E93',
    marginRight: 10,
  },
  versionText: {
    color: '#8E8E93',
    marginRight: 10,
  },
  signOutButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    borderColor: '#FF3B30',
    borderWidth: 1,
    backgroundColor: '#FF3B3010',
  },
  copyright: {
    textAlign: 'center',
    color: '#8E8E93',
    marginTop: 30,
    marginBottom: 40,
    fontSize: 12,
  },
});