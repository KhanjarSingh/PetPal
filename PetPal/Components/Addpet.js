import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function AddPet({ onPetAdded }) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [date, setDate] = useState(new Date());
  const [gender, setGender] = useState('Male');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSubmit = () => {
    if (!name.trim() || !species.trim()) {
      Alert.alert('Missing Information', 'Please provide at least a name and species for your pet.');
      return;
    }

    const newPet = {
      name: name.trim(),
      species: species.trim(),
      breed: breed.trim(),
      birthdate: date.toISOString(),
      gender,
    };

    console.log('New Pet:', newPet);
    Alert.alert('Pet Added!', `${newPet.name} has been added to your family.`);
    if (onPetAdded) {
      onPetAdded(newPet);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pet's Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Buddy"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Species</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={species} onValueChange={(itemValue) => setSpecies(itemValue)}>
          <Picker.Item label="Dog" value="Dog" />
          <Picker.Item label="Cat" value="Cat" />
          <Picker.Item label="Bird" value="Bird" />
          <Picker.Item label="Fish" value="Fish" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <Text style={styles.label}>Breed</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Golden Retriever"
        value={breed}
        onChangeText={setBreed}
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)}>
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      <Text style={styles.label}>Birthdate</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()} 
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  dateText: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});