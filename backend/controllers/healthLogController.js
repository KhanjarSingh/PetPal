const { db } = require("../firebase/firebase");

const getLogsByPetId = async (req, res) => {
    try {
        const { petId } = req.params;

        // Verify pet ownership
        const petDoc = await db.collection("pets").doc(petId).get();
        if (!petDoc.exists || petDoc.data().userId !== req.user.uid) {
            return res.status(403).json({ success: false, error: "Unauthorized access to pet logs" });
        }

        const snapshot = await db
            .collection("healthLogs")
            .where("petId", "==", petId)
            .orderBy("date", "desc")
            .get();
        const logs = snapshot.docs.map((doc) => doc.data());
        res.json({ success: true, logs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getTimelineByPetId = async (req, res) => {
    try {
        const { petId } = req.params;

        // Verify pet ownership
        const petDoc = await db.collection("pets").doc(petId).get();
        if (!petDoc.exists || petDoc.data().userId !== req.user.uid) {
            return res.status(403).json({ success: false, error: "Unauthorized access to pet timeline" });
        }

        const snapshot = await db
            .collection("healthLogs")
            .where("petId", "==", petId)
            .orderBy("date", "asc")
            .get();
        const timeline = snapshot.docs.map((doc) => doc.data());
        res.json({ success: true, timeline });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    getLogsByPetId,
    getTimelineByPetId,
};
