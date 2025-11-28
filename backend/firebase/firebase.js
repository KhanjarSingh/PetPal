const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = process.env.FIREBASE_KEY_PATH;

if (!serviceAccountPath) {
  throw new Error('FIREBASE_KEY_PATH environment variable is not set');
}

const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to initialize Firestore structure with sample documents
async function initializeFirestoreStructure() {
  await db
    .collection("pets")
    .doc("sample-pet")
    .set({
      id: "sample-pet",
      name: "Buddy",
      species: "Dog",
      breed: "Golden Retriever",
      age: 3,
      photoUrl: "https://example.com/photo.jpg",
      vetContact: {
        name: "Dr. Smith",
        phone: "123-456-7890",
      },
    });
  await db
    .collection("tasks")
    .doc("sample-task")
    .set({
      id: "sample-task",
      petId: "sample-pet",
      type: "Vaccination",
      dueDate: admin.firestore.Timestamp.now(),
      recurring: {
        type: "none",
        interval: 0,
      },
      isDone: false,
      doneAt: null,
      note: "First vaccination appointment.",
    });
  await db.collection("healthLogs").doc("sample-healthlog").set({
    id: "sample-healthlog",
    petId: "sample-pet",
    event: "Checkup",
    date: admin.firestore.Timestamp.now(),
    note: "Routine checkup, all good.",
  });
}

module.exports = {
  db,
  admin,
  initializeFirestoreStructure,
};
