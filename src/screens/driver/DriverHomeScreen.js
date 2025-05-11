import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getUserRides, acceptRide } from '../../api/rides';
import { Ionicons } from '@expo/vector-icons';

const DriverHomeScreen = ({ navigation }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRides = async () => {
    try {
      const response = await getUserRides();
      // Filtrăm doar cursele cu status "requested"
      const availableRides = response.filter(ride => ride.status === 'requested');
      setRides(availableRides);
    } catch (error) {
      Alert.alert('Eroare', 'Nu am putut încărca cursele disponibile.');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRides();
    
    // Reîmprospătăm lista la fiecare 30 secunde
    const interval = setInterval(() => {
      loadRides();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadRides();
  };

  const handleAcceptRide = async (rideId) => {
    try {
      await acceptRide(rideId);
      Alert.alert('Succes', 'Ai acceptat cursa cu succes!');
      navigation.navigate('DriverRideDetails', { rideId });
    } catch (error) {
      Alert.alert('Eroare', 'Nu am putut accepta cursa.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a80f5" />
        <Text style={styles.loadingText}>Se încarcă cursele disponibile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {rides.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Nu există curse disponibile momentan</Text>
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
            <View style={styles.rideCard}>
              <View style={styles.rideInfo}>
                <Text style={styles.rideLocation}>
                  <Ionicons name="location" size={16} color="#4a80f5" /> {item.pickup_location}
                </Text>
                <Ionicons name="arrow-down" size={20} color="#ccc" style={styles.arrow} />
                <Text style={styles.rideLocation}>
                  <Ionicons name="location" size={16} color="#f5564a" /> {item.dropoff_location}
                </Text>
                <View style={styles.rideDetails}>
                  <Text style={styles.rideDistance}>
                    <Ionicons name="speedometer-outline" size={14} color="#666" /> {item.distance_km} km
                  </Text>
                  <Text style={styles.ridePrice}>
                    <Ionicons name="cash-outline" size={14} color="#666" /> {item.price} lei
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={() => handleAcceptRide(item.id)}
              >
                <Text style={styles.acceptButtonText}>Acceptă</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rideInfo: {
    flex: 1,
  },
  rideLocation: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  arrow: {
    marginLeft: 8,
    marginVertical: 2,
  },
  rideDetails: {
    flexDirection: 'row',
    marginTop: 10,
  },
  rideDistance: {
    fontSize: 14,
    color: '#666',
    marginRight: 15,
  },
  ridePrice: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: '#4a80f5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DriverHomeScreen;