import { messaging } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      return true;
    }
    return false;
  }

  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      await AsyncStorage.setItem('fcmToken', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  async registerTokenWithBackend(userToken) {
    try {
      const fcmToken = await this.getFCMToken();
      if (!fcmToken) return;

      const response = await fetch('http://localhost:3000/api/notifications/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ fcmToken })
      });

      const result = await response.json();
      console.log('Token registration result:', result);
    } catch (error) {
      console.error('Error registering token:', error);
    }
  }

  async scheduleReminder(userToken, taskId, reminderTime, message) {
    try {
      const response = await fetch('http://localhost:3000/api/notifications/schedule-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ taskId, reminderTime, message })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      return { success: false, error: error.message };
    }
  }

  setupMessageHandlers() {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      // Show local notification or update UI
    });

    return unsubscribe;
  }
}

export default new NotificationService();