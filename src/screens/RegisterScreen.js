// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('client');

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Eroare', 'Parolele nu coincid');
      return;
    }
    
    // Aici ar trebui să implementezi logica de înregistrare
    // Pentru test, vom naviga înapoi la login
    Alert.alert('Succes', 'Cont creat cu succes', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Creează cont</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Prenume"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Nume"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Parolă"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmă parola"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          
          <View style={styles.userTypeContainer}>
            <Text style={styles.label}>Tip utilizator:</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.typeButton, userType === 'client' && styles.activeButton]}
                onPress={() => setUserType('client')}
              >
                <Text style={[styles.typeButtonText, userType === 'client' && styles.activeButtonText]}>
                  Client
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, userType === 'driver' && styles.activeButton]}
                onPress={() => setUserType('driver')}
              >
                <Text style={[styles.typeButtonText, userType === 'driver' && styles.activeButtonText]}>
                  Șofer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Înregistrare</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Ai deja cont? Autentifică-te</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4a80f5',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userTypeContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  activeButton: {
    backgroundColor: '#4a80f5',
    borderColor: '#4a80f5',
  },
  typeButtonText: {
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4a80f5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#4a80f5',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen;