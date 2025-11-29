import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL as API_URL } from '../config';

export default function PetLogs({ petId, petName, onClose }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (petId) {
            fetchLogs();
        }
    }, [petId]);

    const fetchLogs = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_URL}/logs/${petId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                setLogs(data.logs || []);
            } else {
                setError(data.error || 'Failed to fetch logs');
            }
        } catch (err) {
            setError(err.message || 'Error fetching logs');
        } finally {
            setLoading(false);
        }
    };

    const renderLogItem = ({ item }) => {
        const date = item.date?._seconds
            ? new Date(item.date._seconds * 1000).toLocaleDateString()
            : new Date(item.date).toLocaleDateString();

        return (
            <View style={styles.logCard}>
                <View style={styles.logHeader}>
                    <Text style={styles.logType}>{item.type}</Text>
                    <Text style={styles.logDate}>{date}</Text>
                </View>
                <Text style={styles.logDescription}>{item.description}</Text>
                {item.vetName && (
                    <Text style={styles.vetInfo}>Vet: {item.vetName}</Text>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchLogs}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{petName}'s Logs</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>

            {logs.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>No logs found for this pet.</Text>
                </View>
            ) : (
                <FlatList
                    data={logs}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    renderItem={renderLogItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingTop: 20,
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#2563EB',
        fontWeight: '600',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    listContent: {
        padding: 16,
    },
    logCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    logType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        textTransform: 'capitalize',
    },
    logDate: {
        fontSize: 14,
        color: '#6B7280',
    },
    logDescription: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 8,
    },
    vetInfo: {
        fontSize: 13,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    },
    retryButton: {
        padding: 10,
        backgroundColor: '#2563EB',
        borderRadius: 8,
    },
    retryText: {
        color: 'white',
        fontWeight: '600',
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 16,
    },
});
