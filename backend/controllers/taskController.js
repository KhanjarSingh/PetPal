const { db, admin } = require("../firebase/firebase");

const createTask = async (req, res) => {
    try {
        const task = req.body;
        await db.collection("tasks").doc(task.id).set(task);
        res.status(201).json({ success: true, message: "Task created", task });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getDailyTasks = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const snapshot = await db
            .collection("tasks")
            .where("dueDate", ">=", admin.firestore.Timestamp.fromDate(today))
            .where("dueDate", "<", admin.firestore.Timestamp.fromDate(tomorrow))
            .get();
        const tasks = snapshot.docs.map((doc) => doc.data());
        res.json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getUpcomingTasks = async (req, res) => {
    try {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const snapshot = await db
            .collection("tasks")
            .where("dueDate", ">", admin.firestore.Timestamp.fromDate(now))
            .orderBy("dueDate", "asc")
            .get();
        const tasks = snapshot.docs.map((doc) => doc.data());
        res.json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const completeTask = async (req, res) => {
    try {
        const id = req.params.id;
        const doneAt = admin.firestore.Timestamp.now();
        await db.collection("tasks").doc(id).update({ isDone: true, doneAt });
        const updatedDoc = await db.collection("tasks").doc(id).get();
        res.json({ success: true, task: updatedDoc.data() });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    createTask,
    getDailyTasks,
    getUpcomingTasks,
    completeTask,
};
