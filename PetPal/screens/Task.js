import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

const TASKS = [
  {
    id: "t1",
    title: "Vaccination booster",
    petName: "Luna",
    species: "Dog",
    dueDate: "Today",
    dueTime: "5:00 PM",
    notes: "Annual booster shot, carry old reports.",
    petPhoto:
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
  },
  {
    id: "t2",
    title: "Evening walk",
    petName: "Luna",
    species: "Dog",
    dueDate: "Today",
    dueTime: "7:30 PM",
    notes: "Avoid crowded park.",
    petPhoto:
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
  },
  {
    id: "t3",
    title: "Deworming tablet",
    petName: "Milo",
    species: "Cat",
    dueDate: "Tomorrow",
    dueTime: "10:00 AM",
    notes: "Give after breakfast.",
    petPhoto:
      "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg",
  },
  {
    id: "t4",
    title: "Nail trimming",
    petName: "Coco",
    species: "Bird",
    dueDate: "Sat, 30 Nov",
    dueTime: "3:00 PM",
    notes: "",
    petPhoto:
      "https://images.pexels.com/photos/45851/bird-parrot-colorful-macaw-45851.jpeg",
  },
];

const TasksScreen = () => {
  const renderTaskItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.statusBar} />
      <View style={styles.cardContent}>
        <View style={styles.taskHeaderRow}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Image source={{ uri: item.petPhoto }} style={styles.avatar} />
        </View>

        <Text style={styles.petText}>
          {item.petName} • {item.species}
        </Text>

        <View style={styles.timeRow}>
          <Text style={styles.dateText}>{item.dueDate}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.timeText}>{item.dueTime}</Text>
        </View>

        {item.notes ? (
          <Text style={styles.notesText} numberOfLines={2}>
            {item.notes}
          </Text>
        ) : null}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Mark Done</Text>
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

      <FlatList
        data={TASKS}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
