import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone: '',
    is_driver: false
  });
  
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleRegister = async () => {
    // Validare de bază
    if (!formData.username || !formData.email || !formData.password || !formData.password2) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile obligatorii');
      return;
    }

    if (formData.password !== formData.password2) {
      Alert.alert('Eroare', 'Parolele nu se potrivesc');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      Alert.alert('Succes', 'Contul a fost creat cu succes!');
    } catch (error) {
      const errorMessage = Object.values(error).flat().join('\n');
      Alert.alert(
        'Eroare la înregistrare', 
        errorMessage || 'Nu am putut crea contul. Încearcă din nou.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Creează un cont nou</Text>
      <Text style={styles.subtitle}>Completează datele pentru a te înregistra</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nume de utilizator *"
          value={formData.username}
          onChangeText={(text) => handleChange('username', text)}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Parolă *"
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirmă parola *"
          value={formData.password2}
          onChangeText={(text) => handleChange('password2', text)}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Prenume"
          value={formData.first_name}
          onChangeText={(text) => handleChange('first_name', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Nume"
          value={formData.last_name}
          onChangeText={(text) => handleChange('last_name', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Telefon"
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
          keyboardType="phone-pad"
        />
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Înregistrează-te ca șofer</Text>
          <Switch
            value={formData.is_driver}
            onValueChange={(value) => handleChange('is_driver', value)}
            trackColor={{ false: '#ddd', true: '#4a80f5' }}
            thumbColor={formData.is_driver ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Înregistrare</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Ai deja un cont? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Autentifică-te</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4a80f5',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#4a80f5',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;