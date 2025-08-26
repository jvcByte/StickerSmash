import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const colors = Colors[colorScheme ?? 'light'];
  
  // User-specific data
  const vehicleStatus = {
    make: 'Toyota',
    model: 'Camry',
    year: '2020',
    nextService: 'in 1,200 miles',
    serviceDue: '2023-12-15',
    health: 85, // percentage
    issues: 2
  };

  const quickActions = [
    {
      title: 'Schedule Service',
      icon: 'calendar-plus',
      color: '#4a90e2',
      onPress: () => router.push('/services/schedule')
    },
    {
      title: 'Service History',
      icon: 'history',
      color: '#2ecc71',
      onPress: () => router.push('/services/history')
    },
    {
      title: 'My Vehicle',
      icon: 'car',
      color: '#9b59b6',
      onPress: () => router.push('/services')
    },
    {
      title: 'Payments',
      icon: 'credit-card',
      color: '#f39c12',
      onPress: () => router.push('/payments')
    },
    {
      title: 'Support',
      icon: 'headset',
      color: '#e74c3c',
      onPress: () => router.push('/support')
    },
    {
      title: 'Documents',
      icon: 'file-alt',
      color: '#1abc9c',
      onPress: () => router.push('/documents')
    }
  ];

  const upcomingServices = [
    { 
      id: '1', 
      title: 'Oil Change', 
      due: 'in 1,200 miles', 
      date: '2023-12-15',
      icon: 'oil-can', 
      color: '#3498db' 
    },
    { 
      id: '2', 
      title: 'Tire Rotation', 
      due: 'in 2,500 miles', 
      date: '2024-01-10',
      icon: 'car', 
      color: '#2ecc71' 
    },
    { 
      id: '3', 
      title: 'Brake Inspection', 
      due: 'in 5,000 miles', 
      date: '2024-02-20',
      icon: 'car-crash', 
      color: '#e74c3c' 
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          Welcome back! Here&apos;s what&apos;s happening today.
        </ThemedText>
      </ThemedView>
      
      {/* Vehicle Status */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>My Vehicle</ThemedText>
        <ThemedView style={[styles.vehicleCard, { backgroundColor: colors.background }]}>
          <ThemedView style={styles.vehicleHeader}>
            <ThemedText style={[styles.vehicleMake, { color: colors.text }]}>
              {vehicleStatus.year} {vehicleStatus.make} {vehicleStatus.model}
            </ThemedText>
            <ThemedText style={[styles.vehicleSubtitle, { color: colors.tabIconDefault }]}>
              VIN: 1HGCM82633A123456
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.vehicleStats}>
            <ThemedView style={styles.vehicleStat}>
              <ThemedText style={[styles.statValue, { color: colors.tint }]}>{vehicleStatus.health}%</ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.tabIconDefault }]}>Health</ThemedText>
            </ThemedView>
            <ThemedView style={styles.vehicleStat}>
              <ThemedText style={[styles.statValue, { color: colors.tint }]}>{vehicleStatus.issues}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.tabIconDefault }]}>Issues</ThemedText>
            </ThemedView>
            <ThemedView style={styles.vehicleStat}>
              <ThemedText style={[styles.statValue, { color: colors.tint }]}>${'1,200'}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.tabIconDefault }]}>Spent</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.serviceReminder}>
            <FontAwesome5 name="bell" size={16} color="#f39c12" style={styles.bellIcon} />
            <ThemedText style={[styles.reminderText, { color: colors.text }]}>
              Next service due {vehicleStatus.nextService} • {new Date(vehicleStatus.serviceDue).toLocaleDateString()}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={[styles.section, { backgroundColor: colors.background }]}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </ThemedText>
        <ThemedView style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, { backgroundColor: `${action.color}15` }]}
              onPress={action.onPress}
            >
              <FontAwesome5 
                name={action.icon as any} 
                size={20} 
                color={action.color}
                style={styles.actionIcon}
              />
              <ThemedText style={[styles.actionText, { color: colors.text }]}>
                {action.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Upcoming Services */}
      <ThemedView style={[styles.section, { backgroundColor: colors.background }]}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Upcoming Services
          </ThemedText>
          <TouchableOpacity onPress={() => router.push('/services/upcoming')}>
            <ThemedText style={{ color: colors.tint }}>View All</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.servicesList}>
          {upcomingServices.map((service) => (
            <TouchableOpacity 
              key={service.id}
              style={[styles.serviceItem, { 
                backgroundColor: colors.background,
                borderLeftColor: service.color,
                borderLeftWidth: 4,
              }]}
              onPress={() => router.push(`/services/${service.id}`)}
            >
              <ThemedView style={[styles.serviceIcon, { backgroundColor: `${service.color}20` }]}>
                <FontAwesome5 name={service.icon as any} size={16} color={service.color} />
              </ThemedView>
              <ThemedView style={styles.serviceContent}>
                <ThemedText style={[styles.serviceTitle, { color: colors.text }]}>
                  {service.title}
                </ThemedText>
                <ThemedText style={[styles.serviceDue, { color: colors.tabIconDefault }]}>
                  Due {service.due} • {new Date(service.date).toLocaleDateString()}
                </ThemedText>
              </ThemedView>
              <Ionicons name="chevron-forward" size={16} color={colors.icon} />
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>
      
      {/* Quick Help */}
      <ThemedView style={[styles.section, { backgroundColor: colors.background }]}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
          Need Help?
        </ThemedText>
        <ThemedText style={[styles.helpText, { color: colors.tabIconDefault }]}>
          Our service team is available 24/7 to assist you with any questions about your vehicle or upcoming services.
        </ThemedText>
        <TouchableOpacity 
          style={[styles.helpButton, { backgroundColor: colors.tint }]}
          onPress={() => router.push('/support')}
        >
          <ThemedText style={[styles.helpButtonText, { color: colors.background }]}>Contact Support</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    paddingTop: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    flex: 0.48,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    marginBottom: 4,
    opacity: 0.8,
  },
  cardCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '31%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Vehicle Card Styles
  vehicleCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  vehicleHeader: {
    marginBottom: 16,
  },
  vehicleMake: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vehicleSubtitle: {
    fontSize: 14,
  },
  vehicleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  vehicleStat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  serviceReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  bellIcon: {
    marginRight: 8,
  },
  reminderText: {
    flex: 1,
    fontSize: 13,
  },
  
  // Services List
  servicesList: {
    marginTop: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDue: {
    fontSize: 12,
    opacity: 0.8,
  },
  
  // Help Section
  helpText: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  helpButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  helpButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
});
