import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getUserRides, startRide, completeRide, cancelRide } from '../../api/rides';
import { Ionicons } from '@expo/vector-icons';

const DriverRideDetailsScreen = ({ route, navigation }) => {
  const { rideId } = route.params;
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleStartRide = async () => {
    try {
      await startRide(rideId);
      Alert.alert('Succes', 'Cursa a început!');
      loadRideDetails();
    } catch (error) {
      Alert.alert('Eroare', 'Nu am putut începe cursa.');
      console.error(error);
    }
  };

  const handleCompleteRide = async () => {
    try {
      await completeRide(rideId);
      Alert.alert('Succes', 'Cursa a fost finalizată cu succes!');
      loadRideDetails();
    } catch (error) {
      Alert.alert('Eroare', 'Nu am putut finaliza cursa.');
      console.error(error);
    }
  };

  const handleCancelRide = async () => {
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
              await cancelRide(rideId);
              Alert.alert('Succes', 'Cursa a fost anulată.');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Eroare', 'Nu am putut anula cursa.');
              console.error(error);
            }
          }
        },
      ]
    );
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
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Detalii cursă #{ride.id}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text style={[styles.statusValue, getStatusStyle(ride.status)]}>
              {getStatusText(ride.status)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Text style={styles.clientName}>
            <Ionicons name="person" size={16} color="#4a80f5" /> {ride.client.first_name} {ride.client.last_name}
          </Text>
          {ride.client.phone && (
            <Text style={styles.clientPhone}>
              <Ionicons name="call" size={16} color="#4a80f5" /> {ride.client.phone}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locații</Text>
          <Text style={styles.locationText}>
            <Ionicons name="location" size={16} color="#4a80f5" /> {ride.pickup_location}
          </Text>
          <Ionicons name="arrow-down" size={20} color="#ccc" style={styles.arrow} />
          <Text style={styles.locationText}>
            <Ionicons name="location" size={16} color="#f5564a" /> {ride.dropoff_location}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalii cursă</Text>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{ride.distance_km} km</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{ride.price} lei</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {ride.status === 'accepted' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleStartRide}>
              <Text style={styles.actionButtonText}>Începe cursa</Text>
            </TouchableOpacity>
          )}
          
          {ride.status === 'in_progress' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleCompleteRide}>
              <Text style={styles.actionButtonText}>Finalizează cursa</Text>
            </TouchableOpacity>
          )}
          
          {(ride.status === 'accepted' || ride.status === 'in_progress') && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRide}>
              <Text style={styles.cancelButtonText}>Anulează</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const getStatusText = (status) => {
  switch (status) {
    case 'requested': return 'Solicitată';
    case 'accepted': return 'Acceptată';
    case 'in_progress': return 'În desfășurare';
    case 'completed': return 'Finalizată';
    case 'cancelled': return 'Anulată';
    default: return status;
  }
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'requested': return styles.statusRequested;
    case 'accepted': return styles.statusAccepted;
    case 'in_progress': return styles.statusInProgress;
    case 'completed': return styles.statusCompleted;
    case 'cancelled': return styles.statusCancelled;
    default: return {};
  }
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusRequested: {
    backgroundColor: '#fff9c4',
    color: '#ffa000',
  },
  statusAccepted: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  statusInProgress: {
    backgroundColor: '#e8f5e9',
    color: '#388e3c',
  },
  statusCompleted: {
    backgroundColor: '#e8f5e9',
    color: '#388e3c',
  },
  statusCancelled: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  clientName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  clientPhone: {
    fontSize: 14,
    color: '#333',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  arrow: {
    marginLeft: 8,
    marginVertical: 2,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#4a80f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#f5564a',
    fontWeight: 'bold',
  },
});

export default DriverRideDetailsScreen;