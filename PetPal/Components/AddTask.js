import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TASKS_API_URL, PETS_API_URL } from '../config';
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

export default function AddTask({ onTaskAdded }) {


  const [title, setTitle] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      try {
        const res = await fetch(PETS_API_URL, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.pets)) {
          setPets(data.pets);
          setSelectedPet(data.pets[0]?.id || '');
        }
      } catch {}
    };
    fetchPets();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !selectedPet) {
      Alert.alert('Missing Information', 'Please provide a title and select a pet.');
      return;
    }
    const userToken = await AsyncStorage.getItem('userToken');
    const newTask = {
      id: `task_${Date.now()}`,
      petId: selectedPet,
      type: title.trim(),
      dueDate: date.toISOString(),
      recurring: { type: 'none', interval: 0 },
      isDone: false,
      note: notes.trim(),
    };
    try {
      const response = await fetch(TASKS_API_URL.replace('/upcoming', ''), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Task Added!', `"${newTask.type}" has been added.`);
        if (onTaskAdded) onTaskAdded(data.task);
      } else {
        Alert.alert('Error', data.error || 'Failed to add task.');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to add task.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Evening Walk"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>For Pet</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedPet}
          onValueChange={(itemValue) => setSelectedPet(itemValue)}
        >
          {pets.map((pet) => (
            <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Due Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="e.g., Remember the new park"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Task</Text>
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
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
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