import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

type ServiceStatus = 'inProgress' | 'completed' | 'scheduled' | 'overdue';

interface Service {
    id: string;
    date: string;
    type: string;
    status: ServiceStatus;
    services: string[];
    cost: number;
    mileage: number;
    notes?: string;
    scheduledDate?: string;
    estimatedCost?: number;
}

interface CarData {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin: string;
    lastService: string;
    nextService: string;
    mileage: number;
    serviceHistory: Service[];
    upcomingServices: Service[];
}

// Sample data - in a real app, this would come from your API/state
const carData: CarData = {
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    licensePlate: 'ABC-1234',
    vin: '4T1BF1FK7CU123456',
    lastService: '2023-11-15',
    nextService: '2024-02-15',
    mileage: 42500,
    serviceHistory: [
        {
            id: 'service-1',
            date: '2023-11-15',
            type: 'Routine Maintenance',
            status: 'completed',
            services: ['Oil Change', 'Tire Rotation', 'Brake Inspection'],
            cost: 189.99,
            mileage: 41500,
            notes: 'All systems normal. Recommended tire replacement in 5,000 miles.'
        },
        {
            id: 'service-2',
            date: '2023-08-20',
            type: 'Repair',
            status: 'completed',
            services: ['Brake Pad Replacement', 'Brake Fluid Flush'],
            cost: 325.50,
            mileage: 38500,
            notes: 'Front brake pads replaced. Rotors resurfaced.'
        },
        {
            id: 'service-3',
            date: '2023-05-10',
            type: 'Routine Maintenance',
            status: 'completed',
            services: ['Oil Change', 'Air Filter Replacement', 'Cabin Air Filter'],
            cost: 145.75,
            mileage: 35500,
            notes: 'Regular maintenance completed. No issues found.'
        },
    ],
    upcomingServices: [
        {
            id: 'upcoming-1',
            date: '2024-02-15',
            scheduledDate: '2024-02-15',
            type: 'Scheduled Maintenance',
            status: 'scheduled',
            services: ['Oil Change', 'Tire Rotation', 'Fluid Check'],
            cost: 199.99,
            estimatedCost: 199.99,
            mileage: 45000,
            notes: 'Regular scheduled maintenance.'
        },
        {
            id: 'upcoming-2',
            date: '2024-05-15',
            scheduledDate: '2024-05-15',
            type: 'Major Service',
            status: 'scheduled',
            services: ['Transmission Service', 'Coolant Flush', 'Brake Inspection'],
            cost: 349.99,
            estimatedCost: 349.99,
            mileage: 48000,
            notes: 'Major service interval.'
        }
    ]
};

const statusColors = {
    inProgress: '#FFA500',
    completed: '#4CAF50',
    scheduled: '#2196F3',
    overdue: '#F44336'
};

export default function CarServices() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [activeTab, setActiveTab] = useState<'history' | 'upcoming'>('history');
    const [expandedService, setExpandedService] = useState<string | null>(null);

    const toggleService = (id: string) => {
        setExpandedService(expandedService === id ? null : id);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderServiceCard = (service: Service) => {
        const isExpanded = expandedService === service.id;
        const isHistory = activeTab === 'history';
        
        return (
            <ThemedView 
                key={service.id} 
                style={[
                    styles.serviceCard, 
                    { 
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        shadowColor: colors.text
                    }
                ]}
            >
                <ThemedView style={styles.serviceHeader}>
                    <ThemedText style={[styles.serviceType, { color: colors.text }]}>
                        {service.type}
                    </ThemedText>
                    <ThemedView 
                        style={[
                            styles.statusBadge, 
                            { 
                                backgroundColor: `${statusColors[service.status]}20`,
                            }
                        ]}
                    >
                        <ThemedText style={[styles.statusText, { color: statusColors[service.status] }]}>
                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                <ThemedText style={[styles.serviceDate, { color: colors.tabIconDefault }]}>
                    {formatDate(service.date || service.scheduledDate)}
                    {service.mileage && ` • ${service.mileage.toLocaleString()} mi`}
                </ThemedText>

                <ThemedView style={styles.servicesList}>
                    {service.services.slice(0, 3).map((item, index) => (
                        <ThemedView key={index} style={styles.serviceItem}>
                            <Ionicons 
                                name={isHistory ? "checkmark-circle" : "time-outline"} 
                                size={16} 
                                color={isHistory ? "#4CAF50" : "#2196F3"} 
                            />
                            <ThemedText style={[styles.serviceItemText, { color: colors.text }]}>
                                {item}
                            </ThemedText>
                        </ThemedView>
                    ))}
                    {service.services.length > 3 && (
                        <ThemedText style={{ color: colors.tabIconDefault, fontSize: 13, marginTop: 4 }}>
                            +{service.services.length - 3} more services
                        </ThemedText>
                    )}
                </ThemedView>

                <ThemedView style={[styles.serviceFooter, { borderTopColor: colors.border }]}>
                    <ThemedText style={[styles.costText, { color: colors.text }]}>
                        ${(service.cost || service.estimatedCost || 0).toFixed(2)}
                    </ThemedText>
                    <TouchableOpacity 
                        style={[styles.detailsButton, { borderColor: colors.border }]}
                        onPress={() => toggleService(service.id)}
                    >
                        <ThemedText style={[styles.detailsButtonText, { color: colors.tint }]}>
                            {isExpanded ? 'Show Less' : 'View Details'}
                        </ThemedText>
                        <Ionicons 
                            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                            size={16} 
                            color={colors.tint} 
                        />
                    </TouchableOpacity>
                </ThemedView>

                {isExpanded && service.notes && (
                    <ThemedView style={[styles.notesContainer, { backgroundColor: `${colors.border}20` }]}>
                        <ThemedText style={[styles.notesLabel, { color: colors.tabIconDefault }]}>
                            Notes:
                        </ThemedText>
                        <ThemedText style={[styles.notesText, { color: colors.text }]}>
                            {service.notes}
                        </ThemedText>
                    </ThemedView>
                )}
            </ThemedView>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Vehicle Info Card */}
                <ThemedView style={[styles.vehicleCard, { backgroundColor: colors.background }]}>
                    <ThemedView style={styles.vehicleHeader}>
                        <ThemedView style={[styles.carIconContainer, { backgroundColor: `${colors.tint}20` }]}>
                            <Ionicons name="car-sport" size={24} color={colors.tint} />
                        </ThemedView>
                        <ThemedView style={styles.vehicleInfo}>
                            <ThemedText style={[styles.vehicleName, { color: colors.text }]}>
                                {carData.year} {carData.make} {carData.model}
                            </ThemedText>
                            <ThemedText style={[styles.licensePlate, { color: colors.tabIconDefault }]}>
                                {carData.licensePlate} • {carData.mileage.toLocaleString()} mi
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                    <ThemedView style={[styles.nextServiceContainer, { borderTopColor: colors.border }]}>
                        <ThemedText style={[styles.nextServiceLabel, { color: colors.tabIconDefault }]}>
                            Next Service Due:
                        </ThemedText>
                        <ThemedText style={{ color: colors.text, fontWeight: '500' }}>
                            {formatDate(carData.nextService)}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Tabs */}
                <ThemedView style={styles.tabContainer}>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'history' && styles.activeTab]}
                        onPress={() => setActiveTab('history')}
                    >
                        <ThemedText style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
                            Service History
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
                        onPress={() => setActiveTab('upcoming')}
                    >
                        <ThemedText style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
                            Upcoming Services
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {/* Service List */}
                <ThemedView style={styles.serviceList}>
                    {(activeTab === 'history' ? carData.serviceHistory : carData.upcomingServices).map(renderServiceCard)}
                </ThemedView>
            </ScrollView>

            {/* Quick Action Button */}
            <TouchableOpacity style={[styles.fab, { backgroundColor: colors.tint }]}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
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
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    vehicleCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    vehicleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    carIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    licensePlate: {
        fontSize: 14,
        opacity: 0.8,
    },
    nextServiceContainer: {
        paddingTop: 12,
        borderTopWidth: 1,
        marginTop: 12,
    },
    nextServiceLabel: {
        fontSize: 13,
        marginBottom: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#0a7ea4',
        fontWeight: '600',
    },
    serviceList: {
        gap: 12,
    },
    serviceCard: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceType: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    serviceDate: {
        fontSize: 13,
        opacity: 0.8,
        marginBottom: 12,
    },
    servicesList: {
        marginBottom: 12,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    serviceItemText: {
        marginLeft: 8,
        fontSize: 14,
    },
    serviceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        marginTop: 'auto',
    },
    costText: {
        fontSize: 16,
        fontWeight: '600',
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
    },
    detailsButtonText: {
        marginRight: 4,
        fontSize: 14,
        fontWeight: '500',
    },
    notesContainer: {
        marginTop: 12,
        padding: 12,
        borderRadius: 8,
    },
    notesLabel: {
        fontSize: 13,
        marginBottom: 4,
        opacity: 0.8,
    },
    notesText: {
        fontSize: 14,
        lineHeight: 20,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
