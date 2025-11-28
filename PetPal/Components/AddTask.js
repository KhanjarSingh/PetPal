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
const DUMMY_PETS = [
  { id: 'pet1', name: 'Buddy' },
  { id: 'pet2', name: 'Lucy' },
  { id: 'pet3', name: 'Max' },
];

export default function AddTask({ onTaskAdded, onCancel }) {
  const [title, setTitle] = useState('');
  const [selectedPet, setSelectedPet] = useState(DUMMY_PETS[0]?.id);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); 
    setDate(currentDate);
  };
  const handleSubmit = () => {
    if (!title.trim() || !selectedPet) {
      Alert.alert('Missing Information', 'Please provide a title and select a pet.');
      return;
    }

    const newTask = {
      title: title.trim(),
      petId: selectedPet,
      dueDate: date.toISOString(),
      notes: notes.trim(),
      isCompleted: false,
    };
    console.log('New Task:', newTask);
    Alert.alert('Task Added!', `"${newTask.title}" has been added.`);
    if (onTaskAdded) {
      onTaskAdded(newTask);
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
          {DUMMY_PETS.map((pet) => (
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