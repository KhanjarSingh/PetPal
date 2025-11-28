const { db } = require('../firebase/firebase');

const createPet = async (req, res) => {
  try {
    const pet = { ...req.body, userId: req.user.uid };
    if (!pet.id) {
      return res.status(400).json({ success: false, error: "Pet 'id' is required" });
    }
    await db.collection("pets").doc(pet.id).set(pet);
    res.status(201).json({ success: true, message: "Pet created", pet });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getUserPets = async (req, res) => {
  try {
    const snapshot = await db.collection("pets").where("userId", "==", req.user.uid).get();
    const pets = snapshot.docs.map((doc) => doc.data());
    res.json({ success: true, pets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getPetById = async (req, res) => {
  try {
    const doc = await db.collection("pets").doc(req.params.id).get();
    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return res.status(404).json({ success: false, error: "Pet not found" });
    }
    res.json({ success: true, pet: doc.data() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const doc = await db.collection("pets").doc(req.params.id).get();
    if (!doc.exists || doc.data().userId !== req.user.uid) {
      return res.status(404).json({ success: false, error: "Pet not found" });
    }
    const petUpdates = req.body;
    await db.collection("pets").doc(req.params.id).update(petUpdates);
    const updatedDoc = await db.collection("pets").doc(req.params.id).get();
    res.json({ success: true, pet: updatedDoc.data() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createPet,
  getUserPets,
  getPetById,
  updatePet
};