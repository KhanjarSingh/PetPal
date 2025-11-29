import React, { useEffect, useState, useCallback } from "react";
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
  RefreshControl
} from "react-native";

import { TASKS_API_URL, PETS_API_URL, BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [processingTaskId, setProcessingTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const userToken = await AsyncStorage.getItem("userToken");
      
      // Fetch Tasks
      const tasksResponse = await fetch(TASKS_API_URL, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      
      if (!tasksResponse.ok) {
         const errorData = await tasksResponse.json();
         throw new Error(errorData.error || "Failed to fetch tasks");
      }
      const tasksData = await tasksResponse.json();
      const rawTasks = tasksData.tasks || tasksData;
      console.log("Raw tasks count:", rawTasks.length);
      const tasksArr = rawTasks.filter(task => {
        const isCompleted = task.isDone === true;
        if (isCompleted) console.log("Filtering out completed task:", task.type || task.id);
        return !isCompleted;
      });
      console.log("Filtered tasks count:", tasksArr.length);

      // Fetch Pets
      const petsResponse = await fetch(PETS_API_URL, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      let petsMap = {};
      if (petsResponse.ok) {
        const petsData = await petsResponse.json();
        const petsArr = Array.isArray(petsData) ? petsData : petsData.pets || [];
        petsArr.forEach(pet => {
          petsMap[pet.id] = pet;
        });
      }

      // Merge Data
      const mergedTasks = tasksArr.map(task => {
        const pet = petsMap[task.petId] || {};
        return {
          ...task,
          petName: pet.name || "Unknown Pet",
          petPhoto: pet.photoUrl || null,
          species: pet.breed || "Pet",
          title: task.type || "Task"
        };
      });

      console.log("Visible Tasks:", mergedTasks.map(t => ({ id: t.id, title: t.title, isDone: t.isDone, date: t.dueDate })));
      setTasks(mergedTasks);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const showTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const handleMarkDone = async (task) => {
    const taskId = task.id;
    try {
      setProcessingTaskId(taskId);
      const userToken = await AsyncStorage.getItem("userToken");
      
      // Use BASE_URL to construct the correct endpoint: /api/tasks/:id/complete
      const response = await fetch(`${BASE_URL}/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to mark task as done");
      }

      // Optimistically remove the task immediately
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      
      const isRecurring = task.recurring && task.recurring.type !== 'none';
      if (isRecurring) {
        alert("Task done! Next occurrence scheduled.");
      } else {
        alert("Task marked as done!");
      }

      // Refresh data to get updates (including new recurring tasks)
      await fetchData();
    } catch (err) {
      console.error("Error marking task as done:", err);
      alert(err.message || "Failed to mark task as done");
    } finally {
      setProcessingTaskId(null);
    }
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.statusBar} />
      <View style={styles.cardContent}>
        <View style={styles.taskHeaderRow}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          {item.petPhoto ? (
            <Image source={{ uri: item.petPhoto }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E7EB' }]}>
               <Text style={{ fontSize: 18 }}>🐾</Text>
            </View>
          )}
        </View>

        <Text style={styles.petText}>
          {item.petName} • {item.species}
        </Text>

        <View style={styles.timeRow}>
          <Text style={styles.dateText}>
            {item.dueDate && item.dueDate._seconds
              ? new Date(item.dueDate._seconds * 1000).toLocaleDateString()
              : new Date(item.dueDate).toLocaleDateString()}
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.timeText}>
            {item.dueDate && item.dueDate._seconds
              ? new Date(item.dueDate._seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {item.notes ? (
          <Text style={styles.notesText} numberOfLines={2}>
            {item.notes}
          </Text>
        ) : null}

        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => showTaskDetails(item)}
            disabled={processingTaskId === item.id}
          >
            <Text style={styles.secondaryButtonText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.primaryButton,
              processingTaskId === item.id && styles.primaryButtonDisabled
            ]}
            onPress={() => handleMarkDone(item)}
            disabled={processingTaskId === item.id}
          >
            <Text style={styles.primaryButtonText}>
              {processingTaskId === item.id ? "Processing..." : "Mark Done"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Tasks</Text>
        <Text style={styles.subtitle}>
          Stay on top of vaccinations, walks & care.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4F46E5"
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <Text style={{ color: "red", marginTop: 40, textAlign: "center" }}>
          {error}
        </Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <Modal
        visible={!!selectedTask}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedTask(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Task Details</Text>
              <TouchableOpacity onPress={() => setSelectedTask(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {selectedTask && (
                <>
                  <Text style={styles.detailLabel}>Task</Text>
                  <Text style={styles.detailValue}>{selectedTask.title}</Text>
                  
                  <Text style={styles.detailLabel}>Pet</Text>
                  <View style={styles.petDetailRow}>
                    {selectedTask.petPhoto && typeof selectedTask.petPhoto === 'string' && selectedTask.petPhoto.trim() !== '' ? (
                      <Image source={{ uri: selectedTask.petPhoto }} style={styles.detailAvatar} />
                    ) : (
                      <View style={[styles.detailAvatar, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E7EB' }]}>
                         <Text style={{ fontSize: 18 }}>🐾</Text>
                      </View>
                    )}
                    <Text style={styles.detailValue}>{selectedTask.petName} ({selectedTask.species})</Text>
                  </View>

                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={styles.detailValue}>
                    {selectedTask.dueDate && selectedTask.dueDate._seconds
                      ? new Date(selectedTask.dueDate._seconds * 1000).toLocaleString()
                      : new Date(selectedTask.dueDate).toLocaleString()}
                  </Text>

                  <Text style={styles.detailLabel}>Notes</Text>
                  <Text style={styles.detailValue}>
                    {selectedTask.notes || "No additional notes"}
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TasksScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: "hidden",
  },
  statusBar: {
    width: 5,
    backgroundColor: "#4F46E5",
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  taskHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginRight: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  petText: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },
  dot: {
    marginHorizontal: 4,
    fontSize: 12,
    color: "#9CA3AF",
  },
  timeText: {
    fontSize: 12,
    color: "#6B7280",
  },
  notesText: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 8,
  },
  primaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#4F46E5",
  },
  primaryButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
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
    maxHeight: "80%",
    paddingBottom: 30,
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
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    fontSize: 24,
    color: "#6B7280",
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 4,
    marginTop: 12,
  },
  detailValue: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 8,
  },
  petDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#E5E7EB",
  },
});
