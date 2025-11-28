const { db } = require("../firebase/firebase");

const getLogsByPetId = async (req, res) => {
    try {
        const { petId } = req.params;
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
