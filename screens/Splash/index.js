import React, {useState, useEffect, useRef} from 'react';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import {Dimensions, Image} from 'react-native';
import {
  Container,
  HeaderContainer,
  HeadingTextContainer,
  HeadingText,
  ImageLogoContainer,
} from './style';
//import messaging from '@react-native-firebase/messaging';
//import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Splash({navigation}) {
  useEffect(() => {
    AsyncStorage.getItem('loginData').then(data => {
      data = JSON.parse(data);
      console.log('gaxghgcgv',data)
      if (data===null) {
            setTimeout(() => {
              navigation.replace('DriverLogin');
            }, 2000);
          } else {
            navigation.replace('SettingBottomTabs');
          }
    })

    // AsyncStorage.getItem('driverEmail').then(driverEmail => {
    //   console.log('==nnkankcon=>', driverEmail); //null
    //   if (driverEmail == null) {
    //     setTimeout(() => {
    //       navigation.replace('DriverLogin');
    //     }, 2000);
    //   } else {
    //     navigation.replace('SettingBottomTabs');
    //   }
    // });
  }, []);

  // const sendFcmToken = async () => {
  //   const fcmToken = await messaging().getToken();
  //   if (fcmToken) {
  //     AsyncStorage.setItem(
  //       "device_token",
  //       fcmToken
  //     );

  //     axios(`https://pigeon-dev2.herokuapp.com/admin/getDeviceToken/${fcmToken}`)
  //       .then((response) => {
  //          console.log('res',response)
  //       })
  //       .catch((err) => {
  //         console.log("failed", err);
  //       });

  //     messaging().onMessage(remoteMessage => {
  //       //Alert.alert('A new puh notification arrived!', JSON.stringify(remoteMessage));
  //       showNotification(remoteMessage.notification.title,remoteMessage.notification.body)
  //       console.log("remotemessage",remoteMessage.notification.body)
  //       console.log("remotemessage",remoteMessage.notification.title)
  //     });

  //    console.log(fcmToken);
  //    console.log("Your Firebase Token is:", fcmToken);
  //   } else {
  //    console.log("Failed", "No token received");
  //   }
  // }

  // const showNotification = (title,message)=>{
  //   PushNotification.localNotification({
  //       title:title,
  //       message:message
  //   });
  // }

  return (
    <Container>
      <HeaderContainer>
        <ImageLogoContainer>
          <Image
            source={require('../../image/favicon.png')}
            style={{
              width: WIDTH * 0.08,
              height: HEIGHT * 0.06,
              alignSelf: 'center',
            }}
          />
        </ImageLogoContainer>
        <HeadingTextContainer>
          <HeadingText fontFamily="Poppins-Bold">Gale Delivery</HeadingText>
        </HeadingTextContainer>
      </HeaderContainer>
    </Container>
  );
}
