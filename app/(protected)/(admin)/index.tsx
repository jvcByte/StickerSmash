import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const DashboardCard = ({ 
  title, 
  count, 
  icon, 
  color, 
  onPress 
}: { 
  title: string; 
  count: number | string; 
  icon: string; 
  color: string; 
  onPress: () => void 
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  return (
    <TouchableOpacity 
      style={[styles.card, { 
        borderLeftWidth: 4,
        borderLeftColor: color,
        backgroundColor: colors.background,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }]} 
      onPress={onPress}
    >
      <ThemedView style={styles.cardContent}>
        <ThemedView style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <FontAwesome5 name={icon} size={20} color={color} />
        </ThemedView>
        <ThemedView style={styles.cardText}>
          <ThemedText type="defaultSemiBold" style={[styles.cardTitle, { color: colors.text }]}>
            {title}
          </ThemedText>
          <ThemedText style={[styles.cardCount, { color: colors.tabIconSelected }]}>
            {count}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Sample data
  const stats = {
    activeServices: 5,
    pendingApprovals: 3,
    totalCustomers: 124,
    revenue: '$12,450',
    newCustomers: 8,
    inventoryAlerts: 2
  };

  const quickActions = [
    {
      title: 'New Service',
      icon: 'tools',
      color: '#4a90e2',
      onPress: () => router.push('/services')
    },
    {
      title: 'Add Customer',
      icon: 'user-plus',
      color: '#2ecc71',
      onPress: () => router.push('/customers/new')
    },
    {
      title: 'Schedule',
      icon: 'calendar-alt',
      color: '#9b59b6',
      onPress: () => router.push('/services')
    },
    {
      title: 'Inventory',
      icon: 'box-open',
      color: '#f39c12',
      onPress: () => router.push('/cars')
    },
    {
      title: 'Invoices',
      icon: 'file-invoice-dollar',
      color: '#e74c3c',
      onPress: () => router.push('/cars')
    },
    {
      title: 'Reports',
      icon: 'chart-bar',
      color: '#1abc9c',
      onPress: () => router.push('/services')
    }
  ];

  const recentActivities = [
    { id: '1', title: 'Oil change completed', time: '2 hours ago', icon: 'check-circle', color: '#2ecc71' },
    { id: '2', title: 'New appointment scheduled', time: '5 hours ago', icon: 'calendar-check', color: '#3498db' },
    { id: '3', title: 'Payment received', time: '1 day ago', icon: 'dollar-sign', color: '#27ae60' },
    { id: '4', title: 'New customer registered', time: '1 day ago', icon: 'user-plus', color: '#8e44ad' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={[styles.title, { color: colors.text }]}>Dashboard</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          Welcome back! Here&apos;s what&apos;s happening today.
        </ThemedText>
      </ThemedView>
      
      {/* Stats Overview */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Overview</ThemedText>
        <ThemedView style={styles.statsRow}>
          <DashboardCard 
            title="Active Services" 
            icon="tools" 
            count={stats.activeServices} 
            color="#4a90e2"
            onPress={() => router.push('/services')}
          />
          <DashboardCard 
            title="Pending" 
            icon="clock" 
            count={stats.pendingApprovals} 
            color="#f39c12"
            onPress={() => router.push('/services')}
          />
        </ThemedView>
        
        <ThemedView style={styles.statsRow}>
          <DashboardCard 
            title="Customers" 
            icon="users" 
            count={stats.totalCustomers} 
            color="#2ecc71"
            onPress={() => router.push('/customers')}
          />
          <DashboardCard 
            title="Revenue" 
            icon="dollar-sign" 
            count={stats.revenue} 
            color="#e74c3c"
            onPress={() => router.push('/services')}
          />
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

      {/* Recent Activity */}
      <ThemedView style={[styles.section, { backgroundColor: colors.background }]}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activity
          </ThemedText>
          <TouchableOpacity onPress={() => router.push('/services')}>
            <ThemedText style={{ color: colors.tint }}>View All</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.activityList}>
          {recentActivities.map((activity) => (
            <ThemedView 
              key={activity.id} 
              style={[styles.activityItem, { 
                borderBottomColor: colors.icon + '20',
                borderBottomWidth: 1,
                paddingBottom: 12,
                marginBottom: 12
              }]}
            >
              <ThemedView style={[styles.activityIcon, { backgroundColor: `${activity.color}15` }]}>
                <FontAwesome5 name={activity.icon as any} size={16} color={activity.color} />
              </ThemedView>
              <ThemedView style={styles.activityContent}>
                <ThemedText style={[styles.activityTitle, { color: colors.text }]}>
                  {activity.title}
                </ThemedText>
                <ThemedText style={[styles.activityTime, { color: colors.tabIconDefault }]}>
                  {activity.time}
                </ThemedText>
              </ThemedView>
              <Ionicons name="chevron-forward" size={16} color={colors.icon} />
            </ThemedView>
          ))}
        </ThemedView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
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
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.7,
  },
});
