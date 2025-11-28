const { db, admin } = require("../firebase/firebase");

const createTask = async (req, res) => {
    try {
        const task = req.body;
        if (task.dueDate && typeof task.dueDate === 'string') {
            task.dueDate = admin.firestore.Timestamp.fromDate(new Date(task.dueDate));
        }
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

        const groupedTasks = tasks.reduce((acc, task) => {
            const { petId } = task;
            if (!acc[petId]) {
                acc[petId] = [];
            }
            acc[petId].push(task);
            return acc;
        }, {});

        res.json({ success: true, tasks: groupedTasks });
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
        const { note } = req.body;
        const doneAt = admin.firestore.Timestamp.now();

        const taskRef = db.collection("tasks").doc(id);
        const taskDoc = await taskRef.get();

        if (!taskDoc.exists) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        const taskData = taskDoc.data();
        const updateData = { isDone: true, doneAt };
        if (note) {
            updateData.note = note;
        }

        await taskRef.update(updateData);

        if (taskData.recurring && !taskData.isDone) {
            const { type, interval } = taskData.recurring;
            let nextDueDate = new Date(taskData.dueDate);

            if (taskData.dueDate && taskData.dueDate.toDate) {
                nextDueDate = taskData.dueDate.toDate();
            } else if (typeof taskData.dueDate === 'string') {
                nextDueDate = new Date(taskData.dueDate);
            }

            if (type === "daily") {
                nextDueDate.setDate(nextDueDate.getDate() + interval);
            } else if (type === "weekly") {
                nextDueDate.setDate(nextDueDate.getDate() + interval * 7);
            } else if (type === "monthly") {
                nextDueDate.setMonth(nextDueDate.getMonth() + interval);
            }

            const newTaskId = `${taskData.petId}-${Date.now()}`;
            const newTask = {
                ...taskData,
                id: newTaskId,
                dueDate: admin.firestore.Timestamp.fromDate(nextDueDate),
                isDone: false,
                doneAt: null,
                note: null,
            };

            await db.collection("tasks").doc(newTaskId).set(newTask);
        }

        const updatedDoc = await taskRef.get();
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
