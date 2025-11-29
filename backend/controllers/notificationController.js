const { db, admin } = require('../firebase/firebase');
const cron = require('node-cron');

const registerFCMToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) {
      return res.status(400).json({ success: false, error: 'FCM token required' });
    }

    await db.collection('userTokens').doc(req.user.uid).set({
      fcmToken,
      userId: req.user.uid,
      updatedAt: admin.firestore.Timestamp.now()
    });

    res.json({ success: true, message: 'Token registered' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const scheduleReminder = async (req, res) => {
  try {
    const { taskId, reminderTime, message } = req.body;

    const reminder = {
      id: `reminder_${Date.now()}`,
      taskId,
      userId: req.user.uid,
      reminderTime: admin.firestore.Timestamp.fromDate(new Date(reminderTime)),
      message,
      sent: false,
      createdAt: admin.firestore.Timestamp.now()
    };

    await db.collection('reminders').doc(reminder.id).set(reminder);

    res.json({ success: true, message: 'Reminder scheduled', reminder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUserReminders = async (req, res) => {
  try {
    const snapshot = await db.collection('reminders')
      .where('userId', '==', req.user.uid)
      .where('sent', '==', false)
      .orderBy('reminderTime', 'asc')
      .get();

    const reminders = snapshot.docs.map(doc => doc.data());
    res.json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const sendPushNotification = async (userId, title, body) => {
  try {
    const tokenDoc = await db.collection('userTokens').doc(userId).get();
    if (!tokenDoc.exists) return;

    const { fcmToken } = tokenDoc.data();

    const message = {
      notification: { title, body },
      token: fcmToken
    };

    await admin.messaging().send(message);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Cron job to check and send reminders every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = admin.firestore.Timestamp.now();
    const snapshot = await db.collection('reminders')
      .where('sent', '==', false)
      .get();

    for (const doc of snapshot.docs) {
      const reminder = doc.data();

      if (reminder.reminderTime.toDate() <= new Date()) {
        await sendPushNotification(
          reminder.userId,
          'PetPal Reminder',
          reminder.message
        );

        await db.collection('reminders').doc(doc.id).update({ sent: true });
      }
    }
  } catch (error) {
    console.error('Error in reminder cron job:', error);
  }
});

module.exports = {
  registerFCMToken,
  scheduleReminder,
  getUserReminders
};