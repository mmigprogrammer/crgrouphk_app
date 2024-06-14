/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
// index.js
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(remoteMessage);
  PushNotificationIOS.addNotificationRequest({
      id: 'notificationWithSound',
      title: 'hi',
      subtitle: 'Sample Subtitle',
      body: 'Sample local notification with custom sound',
      badge: 1,
  });
});



AppRegistry.registerComponent(appName, () => App);
