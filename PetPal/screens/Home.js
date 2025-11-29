import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";

import { PETS_API_URL, TASKS_API_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddTask from "../Components/AddTask";
import AddPet from "../Components/Addpet";

const HomeScreen = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedPetForTask, setSelectedPetForTask] = useState(null);


  const fetchPetsAndTasks = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("No user token found");
      }
      // Fetch pets
      const petsRes = await fetch(PETS_API_URL, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (!petsRes.ok) throw new Error("Failed to fetch pets");
      const petsData = await petsRes.json();
      console.log("Fetched pets data:", JSON.stringify(petsData, null, 2));
      const petsArr = Array.isArray(petsData)
        ? petsData
        : petsData.pets || [];

      // Fetch upcoming tasks
      let tasksArr = [];
      try {
        const tasksRes = await fetch(TASKS_API_URL, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          tasksArr = Array.isArray(tasksData)
            ? tasksData
            : tasksData.tasks || [];
        } else {
          console.warn("Failed to fetch tasks, status:", tasksRes.status);
        }
      } catch (taskErr) {
        console.warn("Error fetching tasks:", taskErr);
      }

      // Group tasks by petId
      const tasksByPet = {};
      tasksArr.forEach((task) => {
        if (!tasksByPet[task.petId]) tasksByPet[task.petId] = [];
        tasksByPet[task.petId].push(task);
      });

      // Attach upcomingTasks to each pet (sorted by dueDate)
      const petsWithTasks = petsArr.map((pet) => ({
        ...pet,
        upcomingTasks: (tasksByPet[pet.id] || []).sort((a, b) => {
          const aDate = a.dueDate?._seconds
            ? a.dueDate._seconds
            : new Date(a.dueDate).getTime() / 1000;
          const bDate = b.dueDate?._seconds
            ? b.dueDate._seconds
            : new Date(b.dueDate).getTime() / 1000;
          return aDate - bDate;
        }),
      }));
      setPets(petsWithTasks);
    } catch (err) {
      setError(err.message || "Error fetching pets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Home screen mounted");
    fetchPetsAndTasks();
  }, []);

  const renderPetCard = ({ item }) => {
    const nextTask = item.upcomingTasks?.[0];
    // Format time for display
    let nextTaskTime = null;
    if (nextTask) {
      if (nextTask.dueDate?._seconds) {
        const date = new Date(nextTask.dueDate._seconds * 1000);
        nextTaskTime = date.toLocaleString();
      } else if (nextTask.dueDate) {
        nextTaskTime = new Date(nextTask.dueDate).toLocaleString();
      } else if (nextTask.time) {
        nextTaskTime = nextTask.time;
      }
    }

    return (
      <View style={styles.card}>
        <View style={styles.taskBanner}>
          {nextTask ? (
            <>
              <Text style={styles.taskLabel}>Next Task</Text>
              <Text style={styles.taskTitle}>
                {nextTask.title || nextTask.type}
              </Text>
              <Text style={styles.taskTime}>{nextTaskTime}</Text>
            </>
          ) : (
            <Text style={styles.noTaskText}>No upcoming tasks</Text>
          )}
        </View>

        {/* Content row: image + details */}
        <View style={styles.cardContent}>
          <Image source={{ uri: item.photoUrl }} style={styles.petImage} />

          <View style={styles.detailsContainer}>
            <Text style={styles.petName}>{item.name}</Text>
            <Text style={styles.petInfo}>
              {item.species} • {item.breed}
            </Text>
            <Text style={styles.petInfo}>Age: {item.ageYears} years</Text>

            <View style={styles.vetContainer}>
              <Text style={styles.vetLabel}>Vet</Text>
              <Text style={styles.vetText}>{item.vet?.name}</Text>
              <Text style={styles.vetText}>{item.vet?.phone}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>View Log</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => {
              setSelectedPetForTask(item.id);
              setShowAddTaskModal(true);
            }}
          >
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
        <TouchableOpacity 
          style={styles.addPetButton}
          onPress={() => setShowAddPetModal(true)}
        >
          <Text style={styles.addPetText}>+ Add Pet</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4F46E5"
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center", marginTop: 40 }}>
          {error}
        </Text>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderPetCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Pet Modal */}
      <Modal
        visible={showAddPetModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddPetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Pet</Text>
              <TouchableOpacity onPress={() => setShowAddPetModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <AddPet
                onPetAdded={(newPet) => {
                  setShowAddPetModal(false);
                  fetchPetsAndTasks();
                }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        visible={showAddTaskModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddTaskModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Task</Text>
              <TouchableOpacity onPress={() => setShowAddTaskModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <AddTask
                onTaskAdded={(newTask) => {
                  setShowAddTaskModal(false);
                  fetchPetsAndTasks();
                }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    fontSize: 28,
    color: "#6B7280",
    fontWeight: "300",
  },
  modalContent: {
    maxHeight: "100%",
  },
});
