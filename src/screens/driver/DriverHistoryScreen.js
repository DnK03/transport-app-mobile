import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getUserRides } from '../../api/rides';
import { Ionicons } from '@expo/vector-icons';

const DriverHistoryScreen = ({ navigation }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRides = async () => {
    try {
      const response = await getUserRides();
      // Filtrăm cursele finalizate sau anulate
      const historyRides = response.filter(ride => 
        ride.status === 'completed' || ride.status === 'cancelled'
      );
      // Sortăm după data, cele mai recente primele
      historyRides.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setRides(historyRides);
    } catch (error) {
      Alert.alert('Eroare', 'Nu am putut încărca istoricul curselor.');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRides();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadRides();
  };

  const handleRidePress = (rideId) => {
    navigation.navigate('DriverRideDetails', { rideId });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Finalizată';
      case 'cancelled': return 'Anulată';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#388e3c';
      case 'cancelled': return '#d32f2f';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a80f5" />
        <Text style={styles.loadingText}>Se încarcă istoricul curselor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {rides.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Nu ai curse în istoric</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>Reîmprospătează</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.rideCard}
              onPress={() => handleRidePress(item.id)}
            >
              <View style={styles.rideHeader}>
                <Text style={styles.rideDate}>{formatDate(item.updated_at)}</Text>
                <Text style={[styles.rideStatus, { color: getStatusColor(item.status) }]}>
                  {getStatusText(item.status)}
                </Text>
              </View>
              
              <View style={styles.rideLocations}>
                <Text style={styles.rideLocation} numberOfLines={1}>
                  <Ionicons name="location" size={14} color="#4a80f5" /> {item.pickup_location}
                </Text>
                <Ionicons name="arrow-down" size={14} color="#ccc" style={styles.arrow} />
                <Text style={styles.rideLocation} numberOfLines={1}>
                  <Ionicons name="location" size={14} color="#f5564a" /> {item.dropoff_location}
                </Text>
              </View>
              
              <View style={styles.rideFooter}>
                <Text style={styles.rideDistance}>
                  <Ionicons name="speedometer-outline" size={14} color="#666" /> {item.distance_km} km
                </Text>
                <Text style={styles.ridePrice}>
                  <Ionicons name="cash-outline" size={14} color="#666" /> {item.price} lei
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#4a80f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rideDate: {
    fontSize: 12,
    color: '#666',
  },
  rideStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rideLocations: {
    marginBottom: 10,
  },
  rideLocation: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  arrow: {
    marginLeft: 7,
    marginVertical: 2,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  rideDistance: {
    fontSize: 14,
    color: '#666',
  },
  ridePrice: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
});

export default DriverHistoryScreen;