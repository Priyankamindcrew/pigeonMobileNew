/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {
    Platform
   } from 'react-native';
   
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";

 PushNotification.configure({
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
  
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },
  
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios'
  });
  PushNotification.createChannel(
      {
          channelId: "GaleDelivery", // (required)
          channelName: "GaleDeliveryChannel", // (required)
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
  

AppRegistry.registerComponent(appName, () => App);
