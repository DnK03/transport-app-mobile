import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserRides, cancelRide } from '../../api/rides';
import MapView, { Marker } from 'react-native-maps';

const RideDetailsScreen = ({ route, navigation }) => {
  const { rideId } = route.params;
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 47.1585,
    longitude: 27.6014,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const loadRideDetails = async () => {
    try {
      const rides = await getUserRides();
      const currentRide = rides.find(r => r.id === rideId);
      if (currentRide) {
        setRide(currentRide);
      } else {
        Alert.alert('Eroare', 'Nu am putut găsi detaliile cursei.');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Eroare', 'Nu am putut încărca detaliile cursei.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRideDetails();
  }, [rideId]);

  const handleCancelRide = async () => {
    if (!ride || ride.status === 'completed' || ride.status === 'cancelled') return;
    
    Alert.alert(
      'Confirmare',
      'Ești sigur că vrei să anulezi această cursă?',
      [
        { text: 'Nu', style: 'cancel' },
        { 
          text: 'Da', 
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelRide(ride.id);
              Alert.alert('Succes', 'Cursa a fost anulată.');
              loadRideDetails();
            } catch (error) {
              console.error('Error cancelling ride:', error);
              Alert.alert('Eroare', 'Nu am putut anula cursa.');
            }
          }
        },
      ]
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'requested': return 'În așteptare';
      case 'accepted': return 'Acceptată';
      case 'in_progress': return 'În desfășurare';
      case 'completed': return 'Finalizată';
      case 'cancelled': return 'Anulată';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'requested': return '#ffa000';
      case 'accepted': return '#1976d2';
      case 'in_progress': return '#388e3c';
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
        <Text style={styles.loadingText}>Se încarcă detaliile cursei...</Text>
      </View>
    );
  }

  if (!ride) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Nu am putut găsi detaliile cursei.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Înapoi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
        >
          <Marker
            coordinate={{
              latitude: region.latitude - 0.01,
              longitude: region.longitude - 0.01,
            }}
            title="Locație preluare"
            description={ride.pickup_location}
            pinColor="#4a80f5"
          />
          <Marker
            coordinate={{
              latitude: region.latitude + 0.01,
              longitude: region.longitude + 0.01,
            }}
            title="Destinație"
            description={ride.dropoff_location}
            pinColor="#f5564a"
          />
          {(ride.status === 'accepted' || ride.status === 'in_progress') && (
            <Marker
              coordinate={{
                latitude: region.latitude - 0.005,
                longitude: region.longitude - 0.005,
              }}
              title="Șofer"
              description="Șoferul tău"
            >
              <Ionicons name="car" size={24} color="#333" />
            </Marker>
          )}
        </MapView>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Detalii cursă</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ride.status) }]}>
            <Text style={styles.statusText}>{getStatusText(ride.status)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <Text style={styles.dateText}>{formatDate(ride.created_at)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locații</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#4a80f5" />
            <Text style={styles.locationText}>{ride.pickup_location}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#f5564a" />
            <Text style={styles.locationText}>{ride.dropoff_location}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalii</Text>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{ride.distance_km} km</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{ride.price} lei</Text>
            </View>
          </View>
        </View>

        {ride.driver && (ride.status === 'accepted' || ride.status === 'in_progress' || ride.status === 'completed') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Șofer</Text>
            <View style={styles.driverContainer}>
              <View style={styles.driverInfo}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>
                    {ride.driver.first_name?.charAt(0) || 'D'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.driverName}>
                    {ride.driver.first_name} {ride.driver.last_name}
                  </Text>
                  <Text style={styles.carInfo}>
                    {ride.driver.car_model} • {ride.driver.car_plate}
                  </Text>
                </View>
              </View>
              {(ride.status === 'accepted' || ride.status === 'in_progress') && (
                <TouchableOpacity style={styles.callButton}>
                  <Ionicons name="call" size={20} color="#4a80f5" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {(ride.status === 'requested' || ride.status === 'accepted') && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelRide}
          >
            <Text style={styles.cancelButtonText}>Anulează cursa</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f5564a',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4a80f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 200,
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 30,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  driverContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a80f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  driverAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  driverName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  carInfo: {
    fontSize: 12,
    color: '#666',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f5564a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#f5564a',
    fontWeight: 'bold',
  },
});

export default RideDetailsScreen;