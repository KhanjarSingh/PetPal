import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

const PETS = [
  {
    id: "1",
    name: "Luna",
    species: "Dog",
    breed: "Labrador Retriever",
    ageYears: 3,
    photoUrl: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
    vet: {
      name: "Dr. Sharma",
      phone: "+91 98765 43210",
    },
    upcomingTasks: [
      { id: "t1", title: "Vaccination booster", time: "Today • 5:00 PM" },
      { id: "t2", title: "Evening walk", time: "Today • 7:30 PM" },
    ],
  },
  {
    id: "2",
    name: "Milo",
    species: "Cat",
    breed: "Persian",
    ageYears: 2,
    photoUrl: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg",
    vet: {
      name: "Dr. Patel",
      phone: "+91 91234 56789",
    },
    upcomingTasks: [
      { id: "t3", title: "Deworming tablet", time: "Tomorrow • 10:00 AM" },
    ],
  },
  {
    id: "3",
    name: "Coco",
    species: "Bird",
    breed: "Cockatiel",
    ageYears: 1,
    photoUrl: "https://images.pexels.com/photos/45851/bird-parrot-colorful-macaw-45851.jpeg",
    vet: {
      name: "Dr. Rao",
      phone: "+91 99887 66554",
    },
    upcomingTasks: [],
  },
];

const HomeScreen = () => {
  const renderPetCard = ({ item }) => {
    const nextTask = item.upcomingTasks?.[0];

    return (
      <View style={styles.card}>
        <View style={styles.taskBanner}>
          {nextTask ? (
            <>
              <Text style={styles.taskLabel}>Next Task</Text>
              <Text style={styles.taskTitle}>{nextTask.title}</Text>
              <Text style={styles.taskTime}>{nextTask.time}</Text>
            </>
          ) : (
            <Text style={styles.noTaskText}>No upcoming tasks</Text>
          )}
        </View>

        {/* Content row: image + details */}
        <View style={styles.cardContent}>
          <Image
            source={{ uri: item.photoUrl }}
            style={styles.petImage}
          />

          <View style={styles.detailsContainer}>
            <Text style={styles.petName}>{item.name}</Text>
            <Text style={styles.petInfo}>
              {item.species} • {item.breed}
            </Text>
            <Text style={styles.petInfo}>Age: {item.ageYears} years</Text>

            <View style={styles.vetContainer}>
              <Text style={styles.vetLabel}>Vet</Text>
              <Text style={styles.vetText}>{item.vet.name}</Text>
              <Text style={styles.vetText}>{item.vet.phone}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>View Log</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.title}>Your Pets</Text>
        </View>
        <TouchableOpacity style={styles.addPetButton}>
          <Text style={styles.addPetText}>+ Add Pet</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={PETS}
        keyExtractor={(item) => item.id}
        renderItem={renderPetCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  greeting: {
    fontSize: 14,
    color: "#6B7280",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },
  addPetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  addPetText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3, 
    shadowColor: "#000", 
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  taskBanner: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#EEF2FF",
  },
  taskLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4F46E5",
    textTransform: "uppercase",
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginTop: 2,
  },
  taskTime: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 1,
  },
  noTaskText: {
    fontSize: 13,
    color: "#6B7280",
  },
  cardContent: {
    flexDirection: "row",
    padding: 12,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  petName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  petInfo: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 2,
  },
  vetContainer: {
    marginTop: 8,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
  },
  vetLabel: {
    fontSize: 11,
    color: "#6B7280",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 2,
  },
  vetText: {
    fontSize: 12,
    color: "#374151",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  primaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#4F46E5",
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },
});
