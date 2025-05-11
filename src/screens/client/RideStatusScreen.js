import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserRides, cancelRide } from '../../api/rides';
import MapView, { Marker } from 'react-native-maps';

const RideStatusScreen = ({ navigation }) => {
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 47.1585,
    longitude: 27.6014,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const loadActiveRide = async () => {
    try {
      const rides = await getUserRides();
      // Găsim cursa activă (solicitată, acceptată sau în desfășurare)
      const active = rides.find(ride => 
        ride.status === 'requested' || 
        ride.status === 'accepted' || 
        ride.status === 'in_progress'
      );
      
      setActiveRide(active);
      
      if (active) {
        // Simulăm poziția pe hartă
        setRegion({
          latitude: 47.1585,
          longitude: 27.6014,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error('Error loading active ride:', error);
      Alert.alert('Eroare', 'Nu am putut încărca detaliile cursei.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveRide();
    
    // Reîmprospătăm statusul la fiecare 10 secunde
    const interval = setInterval(() => {
      loadActiveRide();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCancelRide = async () => {
    if (!activeRide) return;
    
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
              await cancelRide(activeRide.id);
              Alert.alert('Succes', 'Cursa a fost anulată.');
              navigation.navigate('RequestRide');
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
      default: return status;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'requested': return 'Așteptăm un șofer să accepte cursa ta...';
      case 'accepted': return 'Șoferul este în drum spre tine!';
      case 'in_progress': return 'Ești în drum spre destinație!';
      default: return '';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a80f5" />
        <Text style={styles.loadingText}>Se încarcă detaliile cursei...</Text>
      </View>
    );
  }

  if (!activeRide) {
    return (
      <View style={styles.centered}>
        <Ionicons name="car-outline" size={60} color="#ccc" />
        <Text style={styles.noRideText}>Nu ai nicio cursă activă</Text>
        <TouchableOpacity 
          style={styles.requestButton}
          onPress={() => navigation.navigate('RequestRide')}
        >
          <Text style={styles.requestButtonText}>Solicită o cursă</Text>
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
            description={activeRide.pickup_location}
            pinColor="#4a80f5"
          />
          <Marker
            coordinate={{
              latitude: region.latitude + 0.01,
              longitude: region.longitude + 0.01,
            }}
            title="Destinație"
            description={activeRide.dropoff_location}
            pinColor="#f5564a"
          />
          {activeRide.status !== 'requested' && (
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

      <View style={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <View>
            <Text style={styles.statusTitle}>{getStatusText(activeRide.status)}</Text>
            <Text style={styles.statusDescription}>{getStatusDescription(activeRide.status)}</Text>
          </View>
          <View style={[styles.statusBadge, getStatusBadgeStyle(activeRide.status)]}>
            <Ionicons name={getStatusIcon(activeRide.status)} size={20} color="#fff" />
          </View>
        </View>

        <View style={styles.rideDetails}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#4a80f5" />
            <Text style={styles.locationText} numberOfLines={1}>{activeRide.pickup_location}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#f5564a" />
            <Text style={styles.locationText} numberOfLines={1}>{activeRide.dropoff_location}</Text>
          </View>
        </View>

        {activeRide.status !== 'requested' && activeRide.driver && (
          <View style={styles.driverContainer}>
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>
                  {activeRide.driver.first_name?.charAt(0) || 'D'}
                </Text>
              </View>
              <View>
                <Text style={styles.driverName}>
                  {activeRide.driver.first_name} {activeRide.driver.last_name}
                </Text>
                <Text style={styles.carInfo}>
                  {activeRide.driver.car_model} • {activeRide.driver.car_plate}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call" size={20} color="#4a80f5" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.priceContainer}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Distanță</Text>
            <Text style={styles.priceValue}>{activeRide.distance_km} km</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Preț</Text>
            <Text style={styles.priceValue}>{activeRide.price} lei</Text>
          </View>
        </View>

        {activeRide.status !== 'in_progress' && (
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

const getStatusIcon = (status) => {
  switch (status) {
    case 'requested': return 'time-outline';
    case 'accepted': return 'car-outline';
    case 'in_progress': return 'navigate-outline';
    default: return 'help-outline';
  }
};

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'requested': return styles.statusRequested;
    case 'accepted': return styles.statusAccepted;
    case 'in_progress': return styles.statusInProgress;
    default: return {};
  }
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noRideText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  requestButton: {
    backgroundColor: '#4a80f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 250,
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  statusContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRequested: {
    backgroundColor: '#ffa000',
  },
  statusAccepted: {
    backgroundColor: '#1976d2',
  },
  statusInProgress: {
    backgroundColor: '#388e3c',
  },
  rideDetails: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
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
  driverContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  carInfo: {
    fontSize: 14,
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
  priceContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
  },
  priceDivider: {
    width: 1,
    backgroundColor: '#eee',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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

export default RideStatusScreen;