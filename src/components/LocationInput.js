import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Înlocuiește cu cheia ta API Google Places
const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';

const LocationInput = ({ placeholder, value, onLocationSelect }) => {
  const [predictions, setPredictions] = useState([]);
  const [inputValue, setInputValue] = useState(value || '');

  const handleChangeText = async (text) => {
    setInputValue(text);
    
    if (text.length > 2) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_PLACES_API_KEY}&components=country:ro`
        );
        const data = await response.json();
        
        if (data.predictions) {
          setPredictions(data.predictions);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    } else {
      setPredictions([]);
    }
  };

  const handleSelectLocation = async (placeId, description) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      
      if (data.result && data.result.geometry && data.result.geometry.location) {
        const { lat, lng } = data.result.geometry.location;
        
        onLocationSelect({
          description,
          latitude: lat,
          longitude: lng,
        });
        
        setInputValue(description);
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="location" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={inputValue}
          onChangeText={handleChangeText}
        />
        {inputValue.length > 0 && (
          <TouchableOpacity 
            onPress={() => {
              setInputValue('');
              setPredictions([]);
            }}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      
      {predictions.length > 0 && (
        <FlatList
          data={predictions}
          keyExtractor={(item) => item.place_id}
          style={styles.predictionsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.predictionItem}
              onPress={() => handleSelectLocation(item.place_id, item.description)}
            >
              <Ionicons name="location-outline" size={16} color="#666" style={styles.predictionIcon} />
              <Text style={styles.predictionText}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  predictionsList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  predictionIcon: {
    marginRight: 10,
  },
  predictionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default LocationInput;