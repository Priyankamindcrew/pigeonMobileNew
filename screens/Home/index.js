import React, {useState, useEffect, useRef} from 'react';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast, {DURATION} from 'react-native-easy-toast';
import {
  ScrollView,
  Dimensions,
  Image,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  HeaderContainer,
  Separator,
  RowFiveLocation,
  RowFiveInnerContainer1Location,
  LocationToHeadingLocation,
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
  DetailsButtonContainer1,
  DetailButtonContainerInner1,
  DetailButtonContainerInner2,
  RowFiveInnerContainer3,
  StatusContainer,
  StatusDownImgContainer,
} from './style';
import Header from '../../components/Header';
import openMap from 'react-native-open-maps';
import {createOpenLink, createMapLink} from 'react-native-open-maps';
import Geocoder from 'react-native-geocoder';
// import Geolocation from 'react-native-geolocation-service';
import GetLocation from 'react-native-get-location';

export default function Home({navigation}) {
  const [date, setDate] = useState('');
  const [drEmail, setDrEmail] = useState('');
  const [data, setData] = useState([]);
  const [empty, setEmpty] = useState('');
  const [deliveryDate, setDeliveryDate] = useState([]);
  const [select, setSelect] = useState(null);
  const [selectItem, setSelectItem] = useState('');
  const [updateData, setUpdateData] = useState(false);
  const [loader, setLoader] = useState(true);
  //
  const [driversAddress, setDriversAddress] = useState([]);
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  const DropDownData = [
    {id: 1, label: 'picked-up', value: 'picked-up'},
    {id: 2, label: 'delivered', value: 'delivered'},
    {id: 3, label: 'in-transit', value: 'in-transit'},
  ];

  useEffect(() => {
    AsyncStorage.getItem('loginData').then(data => {
      data = JSON.parse(data);
      axios(
        `https://pigeon-dev2.herokuapp.com/driver/driver-orders/${data['driverEmail']}/${data['driverId']}`,
      )
        .then(response => {
          if (response.data.data === undefined) {
            setLoader(false);
            setEmpty('No orders found for today');
          } else {
            setLoader(false);
            setData(response.data.data);
            setDate(response.data.datetime);
            setDeliveryDate(response.data.deliveryDateArr);
          }
        })
        .catch(err => {
          console.log('failed', err);
        });
    });
  }, [updateData]);

  const mylocationFunc = (toOrder) => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log('Position...', location);
         openMap({
          provider: 'google',
          start: `${location.latitude}, ${location.longitude}`,
          end: `${toOrder}`,
          travelType: 'drive',
        });
      })
      .catch(error => {
        console.log('Position Error...', error);
        const {code, message} = error;
        console.warn(code, message);
      });
  };

  const handlePress = val => {
    const acti = select === val ? -1 : val;
    setSelect(acti);
  };

  const handleRowPress = (val1, val2, val3) => {
    setSelectItem(val1);
    setSelect(-1);
    const dataNew = {
      status: val1,
      oid: val2,
      user_status: val3,
    };

    axios({
      method: 'POST',
      url: `https://pigeon-dev2.herokuapp.com/driver/Update-status`,
      data: dataNew,
    })
      .then(response => {
        // console.log('hello shubham000000000000000000000000', response.data);
        if (response.data.status === 1) {
          console.log('data updated');
          blanktoast.show('Status updated', 1000);
          setUpdateData(!updateData);
        } else {
          console.log('there is problem in updating');
          blanktoast.show('Failed to update status', 1000);
        }
      })
      .catch(err => {
        console.log('failed', err);
      });
  };

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
        {loader ? (
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
              <OrderContainer>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {deliveryDate.map((item1, index1) => {
                    return (
                      <View
                        key={index1}
                        style={{
                          paddingTop: HEIGHT * 0.03,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <View
                            style={{
                              width: WIDTH * 0.78,
                              paddingLeft: 10,
                              paddingRight: 10,
                              paddingTop: HEIGHT * 0.01,
                              paddingBottom: HEIGHT * 0.01,
                              borderBottomWidth: 2,
                              borderLeftWidth: 1,
                              borderRightWidth: 1,
                              borderColor: '#a6a6a6',
                              elevation: 0.5,
                              shadowOffset: {
                                width: 0,
                                height: 1.5,
                              },
                              shadowColor: 'black',
                              shadowOpacity: 5,
                              shadowRadius: 1,
                            }}>
                            <View>
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                  color: 'black',
                                  textAlign: 'center',
                                }}>
                                {item1}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('MapScreen', {
                                data: data,
                              });
                            }}
                            style={{
                              justifyContent: 'center',
                              paddingLeft: WIDTH * 0.02,
                            }}>
                            <Image
                              source={require('../../image/mapmarkIcon.png')}
                            />
                          </TouchableOpacity>
                        </View>
                        {data.map((item, index) => {
                          if (item1 === item.delivery_date) {
                            return (
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
                                <Separator />
                                <RowFive>
                                  <RowFiveInnerContainer1>
                                    <LocationToHeading fontFamily="Poppins-Bold">
                                      Status:
                                    </LocationToHeading>
                                  </RowFiveInnerContainer1>

                                  <RowFiveInnerContainer3
                                    onPress={() => handlePress(index)}>
                                    <StatusContainer>
                                      <LocationToText fontFamily="Poppins-Regular">
                                        {item.status}
                                      </LocationToText>
                                    </StatusContainer>
                                    <StatusDownImgContainer>
                                      <Image
                                        source={require('../../image/DownArrowIcon.png')}
                                      />
                                    </StatusDownImgContainer>
                                  </RowFiveInnerContainer3>
                                </RowFive>
                                {select === index ? (
                                  <View
                                    style={{
                                      borderWidth: 1,
                                      backgroundColor: '#FFFFFF',
                                      width: WIDTH * 0.28,
                                      marginLeft: WIDTH * 0.26,
                                      paddingBottom: 4,
                                      borderColor: '#d9dbda',
                                      borderRadius: 10,
                                    }}>
                                    {DropDownData.map((item1, index1) => (
                                      <TouchableOpacity
                                        key={index1}
                                        onPress={() => {
                                          handleRowPress(
                                            item1.value,
                                            item.order_id,
                                            item.user_status,
                                          );
                                          navigation.navigate('MapScreen', {
                                            data: data,
                                          });
                                        }}>
                                        <Text
                                          style={{
                                            padding: 4,
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            color: 'black',
                                          }}>
                                          {item1.value}
                                        </Text>
                                      </TouchableOpacity>
                                    ))}
                                  </View>
                                ) : null}
                                <Separator />
                                <BtnContainer>
                                  <DetailsButtonContainer
                                    onPress={() => {
                                      console.log(
                                        'llllllllllllllllll.......',
                                        item.order_id,
                                      );
                                      console.log(
                                        'llllllllllllllllll.......',
                                        item,
                                      );
                                      navigation.navigate('OrderDetails', {
                                        orderId: item.order_id,
                                        driverEmail: item.driver_email,
                                      });
                                    }}>
                                    <DetaiButtonText fontFamily="Poppins-Bold">
                                      Details
                                    </DetaiButtonText>
                                  </DetailsButtonContainer>
                                  <DetailsButtonContainer1
                                    onPress={() =>  {
                                      console.log('jvhbdufv...');
                                      mylocationFunc(item.from_order);
                                    }}>
                                    <DetailButtonContainerInner1>
                                      <Image
                                        source={require('../../image/DirectiionIMG.png')}
                                      />
                                    </DetailButtonContainerInner1>
                                    <DetailButtonContainerInner2>
                                      <DetaiButtonText fontFamily="Poppins-Bold">
                                        Get Directions
                                      </DetaiButtonText>
                                    </DetailButtonContainerInner2>
                                  </DetailsButtonContainer1>
                                </BtnContainer>
                              </ContentContainer>
                            );
                          }
                        })}
                      </View>
                    );
                  })}
                </ScrollView>
              </OrderContainer>
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
        <Toast
          position="center"
          ref={ref => {
            blanktoast = ref;
          }}
          style={{backgroundColor: 'black'}}
        />
      </Container>
    </SafeAreaView>
  );
}
