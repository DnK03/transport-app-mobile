import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { getDriverProfile } from '../../api/auth';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api';

const DriverProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const [driverProfile, setDriverProfile] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDriverProfile();
  }, []);

  const loadDriverProfile = async () => {
    try {
      const profile = await getDriverProfile();
      setDriverProfile(profile);
      setIsAvailable(profile.is_available);
    } catch (error) {
      console.error('Error loading driver profile:', error);
      Alert.alert('Eroare', 'Nu am putut încărca profilul de șofer.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async (value) => {
    try {
      setIsAvailable(value);
      await api.patch('/drivers/me/', { is_available: value });
    } catch (error) {
      console.error('Error updating availability:', error);
      Alert.alert('Eroare', 'Nu am putut actualiza disponibilitatea.');
      setIsAvailable(!value); // Revert back if failed
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirmare',
      'Ești sigur că vrei să te deconectezi?',
      [
        { text: 'Nu', style: 'cancel' },
        { 
          text: 'Da', 
          onPress: () => logout()
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a80f5" />
        <Text style={styles.loadingText}>Se încarcă profilul...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.first_name} {user?.last_name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informații șofer</Text>
        
        {driverProfile ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Număr licență:</Text>
              <Text style={styles.infoValue}>{driverProfile.license_number}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Model mașină:</Text>
              <Text style={styles.infoValue}>{driverProfile.car_model}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Număr înmatriculare:</Text>
              <Text style={styles.infoValue}>{driverProfile.car_plate}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rating:</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingValue}>{driverProfile.rating.toFixed(1)}</Text>
                <Ionicons name="star" size={16} color="#FFD700" />
              </View>
            </View>
            
            <View style={styles.availabilityContainer}>
              <Text style={styles.availabilityLabel}>Disponibil pentru curse:</Text>
              <Switch
                value={isAvailable}
                onValueChange={handleAvailabilityToggle}
                trackColor={{ false: '#ddd', true: '#4a80f5' }}
                thumbColor={isAvailable ? '#fff' : '#f4f3f4'}
              />
            </View>
          </>
        ) : (
          <Text style={styles.noProfileText}>Nu există informații de șofer disponibile.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Cont</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nume utilizator:</Text>
          <Text style={styles.infoValue}>{user?.username}</Text>
        </View>
        
        {user?.phone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Telefon:</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Deconectare</Text>
      </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4a80f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  card: {
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
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginRight: 5,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 5,
  },
  availabilityLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  noProfileText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  logoutButton: {
    backgroundColor: '#f5564a',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default DriverProfileScreen;