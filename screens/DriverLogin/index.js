import React, {useState, useEffect, useRef} from 'react';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import axios from 'axios';
import {ScrollView, Dimensions, TextInput, Image, Keyboard} from 'react-native';
import {
  Container,
  HeaderContainer,
  HeadingTextContainer,
  HeadingText,
  ImageLogoContainer,
  FormContainer,
  InputFieldContainer,
  Separator,
  ButtonContainer,
  ButtonText,
  ForgotPasswordText,
  ForgotPassContainer,
} from './style';
import Toast, {DURATION} from 'react-native-easy-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default function DriverLogin({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);

  const handlePressLogin = () => {
    Keyboard.dismiss();

    let rjxemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
    let isEmailValid = rjxemail.test(email);

    if (email === '') {
      blanktoast.show('Please enter email', 1000);
      return false;
    } else if (!isEmailValid) {
      emailtoast.show('Please enter valid email', 1000);
      return false;
    } else if (password === '') {
      blanktoast.show('Please enter password', 1000);
      return false;
    } else {
      setLoader(true);
      const datanew = {
        email,
        password,
      };
      console.log('hello dear', datanew);
      axios({
        method: 'POST',
        url: 'https://pigeon-dev2.herokuapp.com/driver/driver-login',
        data: datanew,
      })
        .then(response => {
          if (response.data.status === 0) {
            setLoader(false);
            invalidtoast.show('Invalid email and password', 1000);
          } else {
            console.log(
              'response from login api',
              response.data.data[0].driver_email,
            );

            var toPassIntoLocal = {
              driverId: JSON.stringify(response.data.data[0].driver_id),
              driverEmail: response.data.data[0].driver_email,
              drivername: response.data.data[0].driver_name,
            };

            //  toPassIntoLocal = JSON.parse(toPassIntoLocal)

            setTimeout(() => {
              loginSuccess.show('Login Successfully', 1000);
            }, 500);
            // AsyncStorage.multiSet([
            //   ['driverId', JSON.stringify(response.data.data[0].driver_id)],
            //   ['driverEmail', response.data.data[0].driver_email],
            //   ['drivername', response.data.data[0].driver_name],
            // ]);

            AsyncStorage.setItem('loginData', JSON.stringify(toPassIntoLocal));

            // AsyncStorage.setItem(
            //   'drivername',
            //   response.data.data[0].driver_name,
            // );
            // AsyncStorage.setItem(
            // 'driverEmail',
            //   response.data.data[0].driver_email,
            // );
            // AsyncStorage.setItem(
            //   'driverId',
            //   JSON.stringify(response.data.data[0].driver_id),
            // );
            // sendFcmToken(response.data.data[0].driver_email)
            setTimeout(() => {
              setLoader(false);
              navigation.replace('SettingBottomTabs');
            }, 1000);
          }
        })
        .catch(err => {
          console.log('failed', err.message);
        });
    }
  };

  // const sendFcmToken = async (drivEmail) => {
  //   const fcmToken = await messaging().getToken();
  //   if (fcmToken) {
  //     AsyncStorage.setItem(
  //       "device_token",
  //       fcmToken
  //     );

  //     axios(`https://pigeon-dev2.herokuapp.com/admin/getDeviceToken/${fcmToken}/${drivEmail}`)
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
      <Spinner visible={loader} textStyle={{color: 'black'}} />
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
          <HeadingText fontFamily="Poppins-Bold">
            Sign In to continue as Gale Driver.
          </HeadingText>
        </HeadingTextContainer>
      </HeaderContainer>
      <ScrollView>
        <FormContainer>
          <InputFieldContainer>
            <Image
              source={require('../../image/emailIcon.png')}
              style={{
                position: 'absolute',
                top: HEIGHT * 0.041,
                left: WIDTH * 0.06,
              }}
            />
            <TextInput
              placeholder="Enter email"
              onChangeText={text => setEmail(text)}
              value={email}
              autoCapitalize="none"
              placeholderTextColor="black"
              style={{
                borderWidth: 2,
                marginTop: HEIGHT * 0.013,
                borderRadius: 50,
                paddingLeft: WIDTH * 0.12,
                borderColor: 'grey',
                height: HEIGHT * 0.07,
                color: 'black',
              }}
            />
          </InputFieldContainer>
          <Separator />
          <InputFieldContainer>
            <Image
              source={require('../../image/eyeCross.png')}
              style={{
                position: 'absolute',
                top: HEIGHT * 0.041,
                left: WIDTH * 0.06,
              }}
            />
            <TextInput
              placeholder="Enter password"
              onChangeText={text => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholderTextColor="black"
              style={{
                borderWidth: 2,
                marginTop: HEIGHT * 0.013,
                borderRadius: 50,
                paddingLeft: WIDTH * 0.12,
                borderColor: 'grey',
                height: HEIGHT * 0.07,
                color: 'black',
              }}
            />
          </InputFieldContainer>
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <ForgotPassContainer
            onPress={() => navigation.navigate('ForgotPass')}>
            <ForgotPasswordText fontFamily="Poppins-SemiBold">
              Forgot Password ?
            </ForgotPasswordText>
          </ForgotPassContainer>
          <Separator />
          <Separator />
          <ButtonContainer onPress={handlePressLogin}>
            <ButtonText fontFamily="Poppins-Bold">Sign in</ButtonText>
          </ButtonContainer>
        </FormContainer>
      </ScrollView>
      <Toast
        position="center"
        ref={ref => {
          emailtoast = ref;
        }}
        style={{backgroundColor: 'black'}}
      />
      <Toast
        position="center"
        ref={ref => {
          blanktoast = ref;
        }}
        style={{backgroundColor: 'black'}}
      />
      <Toast
        position="center"
        ref={ref => {
          invalidtoast = ref;
        }}
        style={{backgroundColor: 'black'}}
      />
      <Toast
        position="center"
        ref={ref => {
          loginSuccess = ref;
        }}
        style={{backgroundColor: 'black'}}
      />
    </Container>
  );
}
