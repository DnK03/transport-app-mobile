import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { requestRide, calculatePrice } from '../../api/rides';
import MapView, { Marker } from 'react-native-maps';

const RequestRideScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [region, setRegion] = useState({
    latitude: 47.1585,  // Coordonate pentru România
    longitude: 27.6014,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Simulăm calculul distanței și prețului
  const handleCalculatePrice = async () => {
    if (!pickupLocation || !dropoffLocation) {
      Alert.alert('Eroare', 'Te rugăm să completezi ambele locații.');
      return;
    }

    setCalculating(true);
    try {
      // În mod normal, aici am face un apel API pentru a calcula distanța reală
      // Pentru demo, vom simula un calcul
      const randomDistance = (Math.random() * 20 + 1).toFixed(1);
      setDistance(parseFloat(randomDistance));
      
      const response = await calculatePrice(pickupLocation, dropoffLocation, randomDistance);
      setPrice(response.price);
    } catch (error) {
      console.error('Error calculating price:', error);
      Alert.alert('Eroare', 'Nu am putut calcula prețul cursei.');
    } finally {
      setCalculating(false);
    }
  };

  const handleRequestRide = async () => {
    if (!pickupLocation || !dropoffLocation || !distance || !price) {
      Alert.alert('Eroare', 'Te rugăm să calculezi prețul înainte de a solicita o cursă.');
      return;
    }

    setLoading(true);
    try {
      await requestRide({
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        distance_km: distance,
        price: price
      });
      
      Alert.alert(
        'Succes', 
        'Cursa a fost solicitată cu succes! Un șofer va accepta cursa în curând.',
        [{ text: 'OK', onPress: () => navigation.navigate('RideStatus') }]
      );
    } catch (error) {
      console.error('Error requesting ride:', error);
      Alert.alert('Eroare', 'Nu am putut solicita cursa. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {pickupLocation && (
            <Marker
              coordinate={{
                latitude: region.latitude - 0.01,
                longitude: region.longitude - 0.01,
              }}
              title="Locație preluare"
              description={pickupLocation}
              pinColor="#4a80f5"
            />
          )}
          {dropoffLocation && (
            <Marker
              coordinate={{
                latitude: region.latitude + 0.01,
                longitude: region.longitude + 0.01,
              }}
              title="Destinație"
              description={dropoffLocation}
              pinColor="#f5564a"
            />
          )}
        </MapView>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Solicită o cursă</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="location" size={24} color="#4a80f5" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Locație preluare"
            value={pickupLocation}
            onChangeText={setPickupLocation}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="location" size={24} color="#f5564a" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Destinație"
            value={dropoffLocation}
            onChangeText={setDropoffLocation}
          />
        </View>

        <TouchableOpacity 
          style={styles.calculateButton} 
          onPress={handleCalculatePrice}
          disabled={calculating}
        >
          {calculating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.calculateButtonText}>Calculează prețul</Text>
          )}
        </TouchableOpacity>

        {distance > 0 && price > 0 && (
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Distanță:</Text>
              <Text style={styles.priceValue}>{distance} km</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Preț estimat:</Text>
              <Text style={styles.priceValue}>{price} lei</Text>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.requestButton,
            (!distance || !price) && styles.disabledButton
          ]} 
          onPress={handleRequestRide}
          disabled={loading || !distance || !price}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="car" size={20} color="#fff" />
              <Text style={styles.requestButtonText}>Solicită cursă</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  calculateButton: {
    backgroundColor: '#4a80f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  requestButton: {
    backgroundColor: '#4a80f5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default RequestRideScreen;