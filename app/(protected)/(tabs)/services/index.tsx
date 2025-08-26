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
        {
            id: 'service-4',
            date: '2023-02-15',
            type: 'Inspection',
            status: 'completed',
            services: ['Multi-point Inspection', 'Fluid Top-off', 'Tire Rotation'],
            cost: 89.99,
            mileage: 32500,
            notes: 'Vehicle in good condition. No immediate concerns.'
        },
        {
            id: 'service-5',
            date: '2022-11-20',
            type: 'Maintenance',
            status: 'completed',
            services: ['Oil Change', 'Tire Rotation', 'Brake Inspection'],
            cost: 129.99,
            mileage: 29500,
            notes: 'Regular service completed. Brakes at 60% life remaining.'
        },
        {
            id: 'service-6',
            date: '2022-08-10',
            type: 'Tire Service',
            status: 'completed',
            services: ['Tire Rotation', 'Wheel Balance', 'Tire Pressure Check'],
            cost: 75.50,
            mileage: 26500,
            notes: 'Tires wearing evenly. Next rotation due in 6,000 miles.'
        }
    ],
    upcomingServices: [
        {
            id: '4',
            date: '2024-02-15',
            scheduledDate: '2024-02-15',
            type: 'Routine Maintenance',
            status: 'scheduled',
            services: ['Oil Change', 'Tire Rotation', 'Fluid Check'],
            cost: 199.99,
            estimatedCost: 199.99,
            mileage: 45000,
            notes: 'Scheduled routine maintenance.'
        },
        {
            id: '5',
            date: '2024-05-15',
            scheduledDate: '2024-05-15',
            type: 'Major Service',
            status: 'scheduled',
            services: ['Transmission Fluid', 'Coolant Flush', 'Spark Plugs'],
            cost: 349.99,
            estimatedCost: 349.99,
            mileage: 48000,
            notes: 'Major scheduled service.'
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

    const calculateServiceProgress = () => {
        const totalServices = carData.serviceHistory.length + carData.upcomingServices.length;
        const completedServices = carData.serviceHistory.length;
        return Math.round((completedServices / totalServices) * 100);
    };

    const progress = calculateServiceProgress();

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
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
                            <ThemedText type="subtitle" style={{ color: colors.text }}>{carData.year} {carData.make} {carData.model}</ThemedText>
                            <ThemedText style={[styles.licensePlate, { color: colors.tabIconDefault }]}>{carData.licensePlate}</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.vehicleDetails}>
                        <ThemedView style={[styles.detailItem, { borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.border }]}>
                            <ThemedText style={[styles.detailLabel, { color: colors.tabIconDefault }]}>VIN</ThemedText>
                            <ThemedText style={{ color: colors.text }}>{carData.vin}</ThemedText>
                        </ThemedView>
                        <ThemedView style={[styles.detailItem, { borderBottomWidth: 1, borderColor: colors.border }]}>
                            <ThemedText style={[styles.detailLabel, { color: colors.tabIconDefault }]}>Mileage</ThemedText>
                            <ThemedText style={{ color: colors.text }}>{carData.mileage.toLocaleString()} mi</ThemedText>
                        </ThemedView>
                        <ThemedView style={[styles.detailItem, { borderRightWidth: 1, borderColor: colors.border }]}>
                            <ThemedText style={[styles.detailLabel, { color: colors.tabIconDefault }]}>Last Service</ThemedText>
                            <ThemedText style={{ color: colors.text }}>{formatDate(carData.lastService)}</ThemedText>
                        </ThemedView>
                        <ThemedView style={[styles.detailItem, { borderColor: colors.border }]}>
                            <ThemedText style={[styles.detailLabel, { color: colors.tabIconDefault }]}>Next Service Due</ThemedText>
                            <ThemedText style={[styles.nextService, { color: colors.tint }]}>
                                {formatDate(carData.nextService)}
                                <ThemedText style={[styles.daysAway, { color: colors.tabIconDefault }]}> (30 days)</ThemedText>
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    {/* Progress Bar */}
                    <ThemedView style={[styles.progressContainer, { borderTopColor: colors.border }]}>
                        <ThemedView style={styles.progressHeader}>
                            <ThemedText style={{ color: colors.text }}>Work Done</ThemedText>
                            <ThemedText style={{ color: colors.text }}>{progress}% Complete</ThemedText>
                        </ThemedView>
                        <ThemedView style={[styles.progressBar, { backgroundColor: `${colors.tabIconDefault}20` }]}>
                            <ThemedView
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${progress}%`,
                                        backgroundColor: progress > 70
                                            ? '#4CAF50'
                                            : progress > 40
                                                ? '#FFC107'
                                                : '#F44336'
                                    }
                                ]}
                            />
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                {/* Tabs */}
                <ThemedView style={styles.tabs}>
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
                    {activeTab === 'history' ? (
                        carData.serviceHistory.map((service) => (
                            <TouchableOpacity
                                key={service.id}
                                style={[styles.serviceCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
                                onPress={() => toggleService(service.id)}
                            >
                                <ThemedView style={styles.serviceHeader}>
                                    <ThemedView>
                                        <ThemedText type="subtitle">{service.type}</ThemedText>
                                        <ThemedText style={styles.serviceDate}>{formatDate(service.date)} • {service.mileage.toLocaleString()} mi</ThemedText>
                                    </ThemedView>
                                    <ThemedView style={[styles.statusBadge, { backgroundColor: statusColors[service.status as keyof typeof statusColors] }]}>
                                        <ThemedText style={styles.statusText}>
                                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                        </ThemedText>
                                    </ThemedView>
                                </ThemedView>

                                {expandedService === service.id && (
                                    <ThemedView style={styles.serviceDetails}>
                                        <ThemedView style={styles.servicesList}>
                                            {service.services.map((item, index) => (
                                                <ThemedView key={index} style={styles.serviceItem}>
                                                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                                    <ThemedText style={styles.serviceItemText}>{item}</ThemedText>
                                                </ThemedView>
                                            ))}
                                        </ThemedView>
                                        {service.notes && (
                                            <ThemedView style={styles.notesContainer}>
                                                <ThemedText style={styles.notesLabel}>Mechanic&apos;s Notes:</ThemedText>
                                                <ThemedText style={styles.notesText}>{service.notes}</ThemedText>
                                            </ThemedView>
                                        )}
                                        <ThemedView style={styles.serviceFooter}>
                                            <ThemedText style={styles.costText}>${service.cost.toFixed(2)}</ThemedText>
                                            <TouchableOpacity style={styles.receiptButton}>
                                                <Ionicons name="receipt-outline" size={16} color="#4a90e2" />
                                                <ThemedText style={styles.receiptText}>ThemedView Receipt</ThemedText>
                                            </TouchableOpacity>
                                        </ThemedView>
                                    </ThemedView>
                                )}
                            </TouchableOpacity>
                        ))
                    ) : (
                        carData.upcomingServices.map((service) => (
                            <ThemedView key={service.id} style={[styles.serviceCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
                                <ThemedView style={styles.serviceHeader}>
                                    <ThemedView>
                                        <ThemedText type="subtitle">{service.type}</ThemedText>
                                        <ThemedText style={styles.serviceDate}>
                                            Scheduled: {formatDate(service.scheduledDate)}
                                        </ThemedText>
                                    </ThemedView>
                                    <ThemedView style={[styles.statusBadge, { backgroundColor: statusColors.scheduled }]}>
                                        <ThemedText style={styles.statusText}>Scheduled</ThemedText>
                                    </ThemedView>
                                </ThemedView>

                                <ThemedView style={styles.servicesList}>
                                    {service.services.map((item, index) => (
                                        <ThemedView key={index} style={styles.serviceItem}>
                                            <Ionicons name="time-outline" size={16} color="#2196F3" />
                                            <ThemedText style={styles.serviceItemText}>{item}</ThemedText>
                                        </ThemedView>
                                    ))}
                                </ThemedView>

                                <ThemedView style={styles.serviceFooter}>
                                    <ThemedText style={styles.estimatedCost}>
                                        {service.estimatedCost ? (
                                            <>
                                                Estimated: <ThemedText style={styles.costText}>${service.estimatedCost.toFixed(2)}</ThemedText>
                                            </>
                                        ) : 'Price available upon request'}
                                    </ThemedText>
                                    <TouchableOpacity style={styles.scheduleButton}>
                                        <ThemedText style={styles.scheduleButtonText}>Schedule Service</ThemedText>
                                    </TouchableOpacity>
                                </ThemedView>
                            </ThemedView>
                        ))
                    )}
                </ThemedView>
            </ScrollView>

            {/* Quick Action Button */}
            <TouchableOpacity style={styles.fab}>
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
        paddingBottom: 100, // Space for FAB button
    },
    vehicleCard: {
        margin: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    vehicleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
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
        marginLeft: 12,
    },
    licensePlate: {
        fontSize: 16,
        color: '#8E8E93',
        marginTop: 4,
    },
    vehicleDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    detailItem: {
        width: '50%',
        marginBottom: 12,
        paddingRight: 8,
    },
    detailLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 2,
    },
    nextService: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    daysAway: {
        fontSize: 12,
        color: '#8E8E93',
    },
    progressContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    tabs: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 8,
        borderBottomWidth: 1,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        marginRight: 8,
    },
    activeTab: {
        borderBottomColor: '#4a90e2',
    },
    tabText: {
        color: '#8E8E93',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#4a90e2',
    },
    serviceList: {
        padding: 16,
    },
    serviceCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    serviceHeaderContent: {
        flex: 1,
        marginRight: 12,
    },
    serviceDate: {
        fontSize: 12,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 80,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '500',
    },
    serviceDetails: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    servicesList: {
        marginBottom: 12,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceItemText: {
        marginLeft: 8,
    },
    notesContainer: {
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    notesLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 14,
        lineHeight: 20,
    },
    serviceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    costText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
    },
    estimatedCost: {
        fontSize: 14,
        color: '#8E8E93',
    },
    receiptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        borderRadius: 6,
    },
    receiptText: {
        color: '#4a90e2',
        marginLeft: 4,
        fontWeight: '500',
    },
    scheduleButton: {
        backgroundColor: '#4a90e2',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    scheduleButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});