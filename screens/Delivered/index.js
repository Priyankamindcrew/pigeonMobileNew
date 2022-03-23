import React, {useState, useEffect} from 'react';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  ScrollView,
  Dimensions,
  Image,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import {
  Container,
  HeaderContainer,
  OrderContainer,
  ContentContainer,
  LocationFromText,
  LocationToHeading,
  LocationToText,
  RowFive,
  RowFiveInnerContainer1,
  RowFiveInnerContainer2,
  DetailsButtonContainer,
  DetaiButtonText,
  AddressContainer,
  AddressContainer1,
  AddressContainer2,
  BtnContainer,
  UpcomeDeliverContainer,
  UpcomeDelInnerContainerOne,
  UpcomInnerTextOne,
  UpcomeDelInnerContainerTwo,
  UpcomInnerTextTwo,
  UpcomeDelInnerContainerThree,
  UpcomInnerTextThree,
  RowFiveLocation,
  RowFiveInnerContainer1Location,
  LocationToHeadingLocation,
  UploadIMGContainer,
  RowFiveIMG,
  RowFiveInnerContainer1IMG,
  LocationToHeadingIMG,
  RowFiveInnerContainer2IMG,
} from './style';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Header from '../../components/Header';
import moment from 'moment';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Toast, {DURATION} from 'react-native-easy-toast';
import ImageWithProgressBar from 'react-native-image-with-progress-bar';

export default function Delivered({navigation}) {
  const todayDate = new Date().toLocaleString('en-US', {
    timeZone: 'America/Toronto',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
  const [fileObj, setFilefileObj] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  //const [modalVisible1, setModalVisible1] = useState(false);
  const [loadImg, setLoadImg] = useState(false);
  //const [filePath, setFilePath] = useState("");
  const [date1, setDate1] = useState(moment(todayDate).format('DD/MM/YYYY'));
  const [drEmail, setDrEmail] = useState('');
  const [data, setData] = useState([]);
  const [empty, setEmpty] = useState('');
  const [deliveryDate, setDeliveryDate] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [chooseDate, setChooseDate] = useState('');
  const statusData = 'delivered';
  const [loading, setLoading] = useState(true);
  const [fullIMG, setFullIMG] = useState('');
  const [oid, setoid] = useState('');
  const [ustatus, setustatus] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('loginData').then(data => {
      data=JSON.parse(data)        //my code 
        setDrEmail(data['driverEmail']);
        axios(
          `https://pigeon-dev2.herokuapp.com/driver/driver-orders-myRides/${data['driverEmail']}/${statusData}?dateDataurl=${date1}`,
        )
          .then(response => {
            console.log(
              `hcjhsac-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=>>>>>> delivered ${date1} `,
              response.data.data,
            );
            if (response.data.data === undefined) {
              setLoading(false);
              setEmpty('No orders found for this day');
            } else {
              setLoading(false);
              setEmpty('');
              setData(response.data.data);
              setDeliveryDate(response.data.deliveryDateArr);
            }
          })
          .catch(err => {
            console.log('failed', err);
          });
      }
      );
  }, [updateData]);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type, id, user_status) => {
    setLoadImg(true);
    console.log('<><><><><><><><><><><><><><><>', id, user_status);
    let options = {
      mediaType: type,
      // maxWidth: 300,
      // maxHeight: 550,
      // quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    console.log('options = ', options);
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    console.log('isCameraPermitted = ', isCameraPermitted);
    console.log('isStoragePermitted = ', isStoragePermitted);

    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }

        setFilefileObj(response.assets[0]);

        const data = new FormData();
        data.append('oid', id);
        data.append('user_status', user_status);
        data.append('CLK_IMG', {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        });
        axios({
          method: 'POST',
          url: 'https://pigeon-dev2.herokuapp.com/driver/image_upload',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(response => {
            setUpdateData(!updateData);
            setLoadImg(false);
            invalidtoast.show('Image uploaded successfully', 1000);
            console.log('data Reasponse<+++++======>', response);
          })
          .catch(err => {
            console.log('failed', err.message);
          });
      });
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const datanew1 = date.toLocaleString('en-US', {
      timeZone: 'America/Toronto',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    const datanewnew = moment(datanew1).format('DD/MM/YYYY');
    setChooseDate(datanewnew);
    setDate1(datanewnew);
    hideDatePicker();
    setUpdateData(!updateData);
  };

  const watchFullIMG = (uri, uoid, status) => {
    console.log('hello', uri);
    setModalVisible(true);
    setFullIMG(uri);
    setoid(uoid);
    setustatus(status);
  };

  // const secondModelOpen = ()=>{
  //   //setModalVisible(false)
  //    //setModalVisible1(true)
  //    console.log("modalVisibleNew",modalVisible1)
  // }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Container>
        <HeaderContainer>
          <Header
            navProp="MapScreen"
            navigation={navigation}
            HeadingText="My Rides"
            showBackBTN={true}
          />
        </HeaderContainer>

        <OrderContainer>
          <View>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 0.5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: WIDTH * 0.79,
                  justifyContent: 'space-around',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: HEIGHT * 0.01,
                  paddingBottom: HEIGHT * 0.01,
                  marginTop: 10,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    {date1}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={showDatePicker}
                style={{
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <Image
                  source={require('../../image/calender.png')}
                  style={{
                    width: WIDTH * 0.05,
                    height: HEIGHT * 0.03,
                  }}
                />
              </TouchableOpacity>
            </View>
            <UpcomeDeliverContainer>
              <UpcomeDelInnerContainerOne
                onPress={() => navigation.navigate('MyRides')}>
                <UpcomInnerTextOne>Upcoming</UpcomInnerTextOne>
              </UpcomeDelInnerContainerOne>
              <UpcomeDelInnerContainerTwo
                onPress={() => navigation.navigate('PickedUp')}>
                <UpcomInnerTextTwo>Picked-Up</UpcomInnerTextTwo>
              </UpcomeDelInnerContainerTwo>
              <UpcomeDelInnerContainerThree>
                <UpcomInnerTextThree>Delivered</UpcomInnerTextThree>
              </UpcomeDelInnerContainerThree>
            </UpcomeDeliverContainer>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          <Modal
            animationType="slide"
            //transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(false);
            }}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                width: '100%',
                height: '70%',
                marginTop: '30%',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{
                  width: WIDTH * 0.1,
                  height: HEIGHT * 0.05,
                  marginLeft: WIDTH * 0.88,
                  //backgroundColor:'red'
                }}>
                <Image
                  source={require('../../image/closeicon.png')}
                  style={{
                    width: WIDTH * 0.1,
                    height: HEIGHT * 0.05,
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  // backgroundColor: 'red',
                  width: '95%',
                  height: '80%',
                  alignSelf: 'center',
                }}>
                {/* <Image
                  source={{ uri: fullIMG }}
                  style={{
                    width: '100%',
                    height: '100%',
                    alignSelf: 'center',
                    resizeMode: 'stretch'
                  }}
                /> */}
                <ImageWithProgressBar
                  mode="spinner"
                  barColor="red"
                  trackColor="black"
                  style={{
                    width: '100%',
                    height: '100%',
                    alignSelf: 'center',
                    resizeMode: 'stretch',
                    transform: [{rotate: '90deg'}],
                  }}
                  imageUrl={fullIMG}
                  onLoadError={error => {
                    console.log('An error occured while loading the image');
                    console.log(error);
                  }}
                />
                {/* {console.log("full",fullIMG)} */}
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: 'blue',
                  padding: 10,
                  marginTop: 15,
                  width: '95%',
                  alignSelf: 'center',
                }}
                onPress={() => {
                  setModalVisible(false);
                  captureImage('photo', oid, ustatus);
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Change Picture
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible1}
            onRequestClose={() => {
              
              //setModalVisible1(false);
              setModalVisible1(false);
            }}
          >
            <View style={{
              backgroundColor: 'black',
              height: '100%',
              justifyContent: 'center'
            }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible1(false)
                  //setModalVisible(false)
                  
                }}
                style={{
                  width: WIDTH * 0.1,
                  height: HEIGHT * 0.05,
                  marginLeft: WIDTH * 0.88
                }}
              >
                <Image
                  source={require("../../image/closeicon.png")}
                  style={{
                    width: WIDTH * 0.1,
                    height: HEIGHT * 0.05,
                  }}
                />
             
              </TouchableOpacity>
              
              <Image
                source={{ uri: fullIMG }}
                style={{
                  width: '100%',
                  height: '50%',
                  marginLeft: WIDTH * 0.03,
                }}
              />
            </View>
          </Modal> */}

          {loading ? (
            <ActivityIndicator
              size="large"
              color="blue"
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          ) : (
            <>
              {empty === '' ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{marginTop: 15}}>
                  {data.map((item, index) => (
                    <ContentContainer key={index}>
                      <RowFive>
                        <RowFiveInnerContainer1>
                          <LocationToHeading fontFamily="Poppins-SemiBold">
                            Order Id:
                          </LocationToHeading>
                        </RowFiveInnerContainer1>
                        <RowFiveInnerContainer2>
                          <LocationToText fontFamily="Poppins-Regular">
                            {item.order_id}
                          </LocationToText>
                        </RowFiveInnerContainer2>
                      </RowFive>
                      <RowFive>
                        <RowFiveInnerContainer1>
                          <LocationToHeading fontFamily="Poppins-SemiBold">
                            Name:
                          </LocationToHeading>
                        </RowFiveInnerContainer1>
                        <RowFiveInnerContainer2>
                          <LocationToText fontFamily="Poppins-Regular">
                            {item.from_name}
                          </LocationToText>
                        </RowFiveInnerContainer2>
                      </RowFive>
                      <RowFiveLocation>
                        <RowFiveInnerContainer1Location>
                          <LocationToHeadingLocation fontFamily="Poppins-Bold">
                            Location:
                          </LocationToHeadingLocation>
                        </RowFiveInnerContainer1Location>
                        <AddressContainer>
                          <AddressContainer1>
                            <Image
                              source={require('../../image/smallgreenmarker3.png')}
                              style={{
                                width: WIDTH * 0.053,
                                height: HEIGHT * 0.025,
                                marginLeft: WIDTH * 0.03,
                              }}
                            />
                          </AddressContainer1>
                          <AddressContainer2>
                            <LocationFromText fontFamily="Poppins-Regular">
                              {item.from_order}
                            </LocationFromText>
                          </AddressContainer2>
                        </AddressContainer>
                      </RowFiveLocation>

                      <RowFiveIMG>
                        <RowFiveInnerContainer1IMG>
                          <LocationToHeadingIMG fontFamily="Poppins-SemiBold">
                            Capture Image:
                          </LocationToHeadingIMG>
                        </RowFiveInnerContainer1IMG>

                        {item.image_name === 'NO IMAGE' ? (
                          <RowFiveInnerContainer2IMG
                            onPress={() => {
                              console.log('hello', item.order_id, index);
                              captureImage(
                                'photo',
                                item.order_id,
                                item.user_status,
                              );
                            }}>
                            <Image
                              source={require('../../image/CameraIMG.jpeg')}
                              style={{
                                width: WIDTH * 0.1,
                                height: HEIGHT * 0.07,
                              }}
                            />
                          </RowFiveInnerContainer2IMG>
                        ) : (
                          <RowFiveInnerContainer2IMG
                            onPress={() =>
                              watchFullIMG(
                                item.image_name,
                                item.order_id,
                                item.user_status,
                              )
                            }>
                            {loadImg ? (
                              <ActivityIndicator />
                            ) : (
                              <Image
                                source={{uri: item.image_name}}
                                onLoadStart={console.log('loading start')}
                                style={{
                                  width: WIDTH * 0.15,
                                  height: HEIGHT * 0.07,
                                }}
                              />
                            )}

                            {/* <Image
                              source={{ uri: item.image_name }}
                              onLoadStart={console.log("loading start")}
                              style={{
                                width: WIDTH * 0.15,
                                height: HEIGHT * 0.07,
                              }}
                            /> */}

                            {/* <ImageWithProgressBar 
                                 onPress={()=>console.log("pressed")}
                                  mode="bar"
                                  barColor="red"
                                  trackColor="black"

                                  style={{
                                    width: WIDTH * 0.15,
                                    height: HEIGHT * 0.07,
                                    
                                  }}
                                  
                                  imageUrl={item.image_name}
                                  
                                  onLoadError={(error)=> {
                                    console.log("An error occured while loading the image");
                                    console.log(error);
                                  }}
                            />         */}
                          </RowFiveInnerContainer2IMG>
                        )}
                      </RowFiveIMG>

                      <BtnContainer>
                        <DetailsButtonContainer
                          onPress={() =>
                            navigation.navigate('OrderDetails', {
                              orderId: item.order_id,
                              driverEmail: item.driver_email,
                            })
                          }>
                          <DetaiButtonText fontFamily="Poppins-Bold">
                            Details
                          </DetaiButtonText>
                        </DetailsButtonContainer>
                      </BtnContainer>
                    </ContentContainer>
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={{
                    alignSelf: 'center',
                    marginTop: HEIGHT * 0.2,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                    }}>
                    {empty}
                  </Text>
                </View>
              )}
            </>
          )}
        </OrderContainer>
        <Toast
          position="center"
          ref={ref => {
            invalidtoast = ref;
          }}
          style={{backgroundColor: 'black'}}
        />
      </Container>
    </SafeAreaView>
  );
}

// import React, { useState, useEffect } from "react";
// const WIDTH = Dimensions.get("window").width;
// const HEIGHT = Dimensions.get("window").height;
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import {
//   ScrollView,
//   Dimensions,
//   Image,
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   ActivityIndicator,
//   PermissionsAndroid,
//   Platform,
//   Modal,
//   Alert
// } from "react-native";
// import {
//   Container,
//   HeaderContainer,
//   OrderContainer,
//   ContentContainer,
//   LocationFromText,
//   LocationToHeading,
//   LocationToText,
//   RowFive,
//   RowFiveInnerContainer1,
//   RowFiveInnerContainer2,
//   DetailsButtonContainer,
//   DetaiButtonText,
//   AddressContainer,
//   AddressContainer1,
//   AddressContainer2,
//   BtnContainer,
//   UpcomeDeliverContainer,
//   UpcomeDelInnerContainerOne,
//   UpcomInnerTextOne,
//   UpcomeDelInnerContainerTwo,
//   UpcomInnerTextTwo,
//   UpcomeDelInnerContainerThree,
//   UpcomInnerTextThree,
//   RowFiveLocation,
//   RowFiveInnerContainer1Location,
//   LocationToHeadingLocation,
//   UploadIMGContainer,
//   RowFiveIMG,
//   RowFiveInnerContainer1IMG,
//   LocationToHeadingIMG,
//   RowFiveInnerContainer2IMG
// } from "./style";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import Header from "../../components/Header";
// import moment from "moment";
// import {
//   launchCamera,
//   launchImageLibrary
// } from 'react-native-image-picker';
// import Toast, { DURATION } from "react-native-easy-toast";
// import ImageWithProgressBar from 'react-native-image-with-progress-bar';

// export default function Delivered({ navigation }) {
//   const todayDate = new Date().toLocaleString("en-US", {
//     timeZone: "America/Toronto",
//     month: "2-digit",
//     day: "2-digit",
//     year: "numeric",
//   });
//   const [fileObj, setFilefileObj] = useState({});
//   const [modalVisible, setModalVisible] = useState(false);
//   //const [modalVisible1, setModalVisible1] = useState(false);

//   //const [filePath, setFilePath] = useState("");
//   const [date1, setDate1] = useState(moment(todayDate).format("DD/MM/YYYY"));
//   const [drEmail, setDrEmail] = useState("");
//   const [data, setData] = useState([]);
//   const [empty, setEmpty] = useState("");
//   const [deliveryDate, setDeliveryDate] = useState([]);
//   const [updateData, setUpdateData] = useState(false);
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [chooseDate, setChooseDate] = useState("");
//   const statusData = "delivered";
//   const [loading, setLoading] = useState(true);
//   const [fullIMG, setFullIMG] = useState("");
//   const [oid, setoid] = useState("");
//   const [ustatus, setustatus] = useState("");

//   useEffect(() => {
//     AsyncStorage.getItem("driverEmail").then((driverEmail) => {
//       setDrEmail(driverEmail);
//       axios(`https://pigeon-dev2.herokuapp.com/driver/driver-orders-myRides/${driverEmail}/${statusData}?dateDataurl=${date1}`)
//         .then((response) => {
//           console.log(
//             `hcjhsac-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=>>>>>> ${date1} `,
//             response.data.data
//           );
//           if (response.data.data === undefined) {
//             setLoading(false);
//             setEmpty("No orders found for this day");
//           } else {
//             setLoading(false);
//             setEmpty("");
//             setData(response.data.data);
//             setDeliveryDate(response.data.deliveryDateArr);
//           }
//         })
//         .catch((err) => {
//           console.log("failed", err);
//         });
//     });
//   }, [updateData]);

//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'App needs camera permission',
//           },
//         );
//         // If CAMERA Permission is granted
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     } else return true;
//   };

//   const requestExternalWritePermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: 'External Storage Write Permission',
//             message: 'App needs write permission',
//           },
//         );
//         // If WRITE_EXTERNAL_STORAGE Permission is granted
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         alert('Write permission err', err);
//       }
//       return false;
//     } else return true;
//   };

//   const captureImage = async (type, id, user_status) => {
//     console.log("<><><><><><><><><><><><><><><>", id, user_status)
//     let options = {
//       mediaType: type,
//       // maxWidth: 300,
//       // maxHeight: 550,
//       // quality: 1,
//       videoQuality: 'low',
//       durationLimit: 30, //Video max duration in seconds
//       saveToPhotos: true,
//     };
//     console.log('options = ', options);
//     let isCameraPermitted = await requestCameraPermission();
//     let isStoragePermitted = await requestExternalWritePermission();
//     console.log('isCameraPermitted = ', isCameraPermitted);
//     console.log('isStoragePermitted = ', isStoragePermitted);

//     if (isCameraPermitted && isStoragePermitted) {
//       launchCamera(options, (response) => {
//         console.log('Response = ', response);

//         if (response.didCancel) {
//           alert('User cancelled camera picker');
//           return;
//         } else if (response.errorCode == 'camera_unavailable') {
//           alert('Camera not available on device');
//           return;
//         } else if (response.errorCode == 'permission') {
//           alert('Permission not satisfied');
//           return;
//         } else if (response.errorCode == 'others') {
//           alert(response.errorMessage);
//           return;
//         }

//         setFilefileObj(response.assets[0]);

//         const data = new FormData();
//         data.append('oid', id);
//         data.append('user_status', user_status);
//         data.append('CLK_IMG', {
//           uri: response.assets[0].uri,
//           type: response.assets[0].type,
//           name: response.assets[0].fileName
//         });
//         axios({
//           method: "POST",
//           url: "https://pigeon-dev2.herokuapp.com/driver/image_upload",
//           data: data,
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           }
//         })
//           .then((response) => {
//             setUpdateData(!updateData);
//             invalidtoast.show("image upload success", 1000);
//             console.log("data Reasponse<+++++======>", response)
//           })
//           .catch((err) => {
//             console.log("failed", err.message);
//           });

//       });
//     }
//   };

//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleConfirm = (date) => {
//     const datanew1 = date.toLocaleString("en-US", {
//       timeZone: "America/Toronto",
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//     });
//     const datanewnew = moment(datanew1).format("DD/MM/YYYY");
//     setChooseDate(datanewnew);
//     setDate1(datanewnew);
//     hideDatePicker();
//     setUpdateData(!updateData);
//   };

//   const watchFullIMG = (uri, uoid, status) => {
//     console.log("hello", uri)
//     setModalVisible(true)
//     setFullIMG(uri)
//     setoid(uoid)
//     setustatus(status)
//   }

//   // const secondModelOpen = ()=>{
//   //   //setModalVisible(false)
//   //    //setModalVisible1(true)
//   //    console.log("modalVisibleNew",modalVisible1)
//   // }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
//       <Container>
//         <HeaderContainer>
//           <Header
//             navProp="MapScreen"
//             navigation={navigation}
//             HeadingText="My Rides"
//             showBackBTN={true}
//           />
//         </HeaderContainer>

//         <OrderContainer>
//           <View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 borderBottomWidth: 0.5,
//               }}
//             >
//               <View
//                 style={{
//                   flexDirection: "row",
//                   width: WIDTH * 0.79,
//                   justifyContent: "space-around",
//                   paddingLeft: 10,
//                   paddingRight: 10,
//                   paddingTop: HEIGHT * 0.01,
//                   paddingBottom: HEIGHT * 0.01,
//                   marginTop: 10,
//                 }}
//               >
//                 <View
//                   style={{
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 18,
//                       fontWeight: "bold",
//                       color: "black",
//                     }}
//                   >
//                     {date1}
//                   </Text>
//                 </View>
//               </View>
//               <TouchableOpacity
//                 onPress={showDatePicker}
//                 style={{
//                   justifyContent: "center",
//                   marginTop: 10,
//                 }}
//               >
//                 <Image
//                   source={require("../../image/calender.png")}
//                   style={{
//                     width: WIDTH * 0.05,
//                     height: HEIGHT * 0.03,
//                   }}
//                 />
//               </TouchableOpacity>
//             </View>
//             <UpcomeDeliverContainer>
//               <UpcomeDelInnerContainerOne
//                 onPress={() => navigation.navigate("MyRides")}
//               >
//                 <UpcomInnerTextOne>Upcoming</UpcomInnerTextOne>
//               </UpcomeDelInnerContainerOne>
//               <UpcomeDelInnerContainerTwo
//                 onPress={() => navigation.navigate("PickedUp")}
//               >
//                 <UpcomInnerTextTwo>Picked-Up</UpcomInnerTextTwo>
//               </UpcomeDelInnerContainerTwo>
//               <UpcomeDelInnerContainerThree>
//                 <UpcomInnerTextThree>Delivered</UpcomInnerTextThree>
//               </UpcomeDelInnerContainerThree>
//             </UpcomeDeliverContainer>

//             <DateTimePickerModal
//               isVisible={isDatePickerVisible}
//               mode="date"
//               onConfirm={handleConfirm}
//               onCancel={hideDatePicker}
//             />
//           </View>

//           <Modal
//             animationType="slide"
//             //transparent={true}
//             visible={modalVisible}
//             onRequestClose={() => {
//               Alert.alert("Modal has been closed.");
//               setModalVisible(false);
//             }}
//           >
//             <View style={{
//               backgroundColor: '#FFFFFF',
//               width: "100%",
//               height: "70%",
//               marginTop: '30%',
//               alignSelf: 'center'
//             }}>
//               <TouchableOpacity
//                 onPress={() => {
//                   setModalVisible(false)
//                 }}
//                 style={{
//                   width: WIDTH * 0.1,
//                   height: HEIGHT * 0.05,
//                   marginLeft: WIDTH * 0.88,
//                   //backgroundColor:'red'
//                 }}
//               >
//                 <Image
//                   source={require("../../image/closeicon.png")}
//                   style={{
//                     width: WIDTH * 0.1,
//                     height: HEIGHT * 0.05,
//                   }}
//                 />
//               </TouchableOpacity>

//               <View
//                 style={{
//                  // backgroundColor: 'red',
//                   width: '95%',
//                   height: '80%',
//                   alignSelf: 'center',
//                 }}
//               >
//                 <Image
//                   source={{ uri: fullIMG }}
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     alignSelf: 'center',
//                     resizeMode: 'stretch'
//                   }}
//                 />
//                 {/* {console.log("full",fullIMG)} */}
//               </View>

//               <TouchableOpacity
//                 style={{
//                   backgroundColor: 'blue',
//                   padding: 10,
//                   marginTop: 15,
//                   width: '95%',
//                   alignSelf: 'center',
//                 }}
//               >
//                 <Text
//                   style={{
//                     alignSelf: 'center',
//                     fontWeight: 'bold',
//                     color: 'white'
//                   }}
//                   onPress={() => {
//                     setModalVisible(false)
//                     captureImage('photo', oid, ustatus);
//                   }}
//                 >Change Picture</Text>
//               </TouchableOpacity>

//             </View>
//           </Modal>

//           {/* <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisible1}
//             onRequestClose={() => {

//               //setModalVisible1(false);
//               setModalVisible1(false);
//             }}
//           >
//             <View style={{
//               backgroundColor: 'black',
//               height: '100%',
//               justifyContent: 'center'
//             }}>
//               <TouchableOpacity
//                 onPress={() => {
//                   setModalVisible1(false)
//                   //setModalVisible(false)

//                 }}
//                 style={{
//                   width: WIDTH * 0.1,
//                   height: HEIGHT * 0.05,
//                   marginLeft: WIDTH * 0.88
//                 }}
//               >
//                 <Image
//                   source={require("../../image/closeicon.png")}
//                   style={{
//                     width: WIDTH * 0.1,
//                     height: HEIGHT * 0.05,
//                   }}
//                 />

//               </TouchableOpacity>

//               <Image
//                 source={{ uri: fullIMG }}
//                 style={{
//                   width: '100%',
//                   height: '50%',
//                   marginLeft: WIDTH * 0.03,
//                 }}
//               />
//             </View>
//           </Modal> */}

//           {loading ? (
//             <ActivityIndicator
//               size="large"
//               color="blue"
//               style={{
//                 flex: 1,
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             />
//           ) : (
//             <>
//               {empty === "" ? (
//                 <ScrollView
//                   showsVerticalScrollIndicator={false}
//                   style={{ marginTop: 15 }}
//                 >
//                   {data.map((item, index) => (
//                     <ContentContainer key={index}>
//                       <RowFive>
//                         <RowFiveInnerContainer1>
//                           <LocationToHeading fontFamily="Poppins-SemiBold">
//                             Order Id:
//                           </LocationToHeading>
//                         </RowFiveInnerContainer1>
//                         <RowFiveInnerContainer2>
//                           <LocationToText fontFamily="Poppins-Regular">
//                             {item.order_id}
//                           </LocationToText>
//                         </RowFiveInnerContainer2>
//                       </RowFive>
//                       <RowFive>
//                         <RowFiveInnerContainer1>
//                           <LocationToHeading fontFamily="Poppins-SemiBold">
//                             Name:
//                           </LocationToHeading>
//                         </RowFiveInnerContainer1>
//                         <RowFiveInnerContainer2>
//                           <LocationToText fontFamily="Poppins-Regular">
//                             {item.from_name}
//                           </LocationToText>
//                         </RowFiveInnerContainer2>
//                       </RowFive>
//                       <RowFiveLocation>
//                         <RowFiveInnerContainer1Location>
//                           <LocationToHeadingLocation fontFamily="Poppins-Bold">
//                             Location:
//                           </LocationToHeadingLocation>
//                         </RowFiveInnerContainer1Location>
//                         <AddressContainer>
//                           <AddressContainer1>
//                             <Image
//                               source={require("../../image/smallgreenmarker3.png")}
//                               style={{
//                                 width: WIDTH * 0.053,
//                                 height: HEIGHT * 0.025,
//                                 marginLeft: WIDTH * 0.03,
//                               }}
//                             />
//                           </AddressContainer1>
//                           <AddressContainer2>
//                             <LocationFromText fontFamily="Poppins-Regular">
//                               {item.from_order}
//                             </LocationFromText>
//                           </AddressContainer2>
//                         </AddressContainer>
//                       </RowFiveLocation>

//                       <RowFiveIMG>
//                         <RowFiveInnerContainer1IMG>
//                           <LocationToHeadingIMG fontFamily="Poppins-SemiBold">
//                             Capture Image:
//                           </LocationToHeadingIMG>
//                         </RowFiveInnerContainer1IMG>

//                         {item.image_name === 'NO IMAGE' ? (
//                           <RowFiveInnerContainer2IMG onPress={() => {
//                             console.log("hello", item.order_id, index)
//                             captureImage('photo', item.order_id, item.user_status);
//                           }}>
//                             <Image
//                               source={require("../../image/CameraIMG.jpeg")}
//                               style={{
//                                 width: WIDTH * 0.1,
//                                 height: HEIGHT * 0.07,
//                               }}
//                             />
//                           </RowFiveInnerContainer2IMG>
//                         ) : (
//                           <RowFiveInnerContainer2IMG onPress={() => watchFullIMG(item.image_name, item.order_id, item.user_status)}>
//                             <Image
//                               source={{ uri: item.image_name }}
//                               onLoadStart={console.log("loading start")}
//                               style={{
//                                 width: WIDTH * 0.15,
//                                 height: HEIGHT * 0.07,
//                               }}
//                             />
//                           </RowFiveInnerContainer2IMG>
//                         )}
//                         {/* : */}
//                         {/* <RowFiveInnerContainer2IMG onPress={() => setModalVisible(true)}>
//                             <Image
//                               source={{ uri: fileObj.uri }}
//                               style={{
//                                 width: WIDTH * 0.15,
//                                 height: HEIGHT * 0.07,
//                               }}
//                             />
//                           </RowFiveInnerContainer2IMG> */}
//                         {/* } */}
//                       </RowFiveIMG>

//                       <BtnContainer>
//                         <DetailsButtonContainer
//                           onPress={() =>
//                             navigation.navigate("OrderDetails", {
//                               orderId: item.order_id,
//                               driverEmail: item.driver_email,
//                             })
//                           }
//                         >
//                           <DetaiButtonText fontFamily="Poppins-Bold">
//                             Details
//                           </DetaiButtonText>
//                         </DetailsButtonContainer>
//                       </BtnContainer>
//                     </ContentContainer>
//                   ))}
//                 </ScrollView>
//               ) : (
//                 <View
//                   style={{
//                     alignSelf: "center",
//                     marginTop: HEIGHT * 0.2,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 20,
//                     }}
//                   >
//                     {empty}
//                   </Text>
//                 </View>
//               )}
//             </>
//           )}
//         </OrderContainer>
//         <Toast
//           position="center"
//           ref={(ref) => {
//             invalidtoast = ref;
//           }}
//           style={{ backgroundColor: "black" }}
//         />
//       </Container>
//     </SafeAreaView>
//   );
// }
