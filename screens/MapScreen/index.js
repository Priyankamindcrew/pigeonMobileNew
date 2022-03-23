import React, {useState, useEffect, useRef} from 'react';
import * as Animatable from 'react-native-animatable';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import {HeaderContainer} from './style';

import {
  Separator,
  RowFiveLocation,
  RowFiveInnerContainer1Location,
  LocationToHeadingLocation,
  LocationFromText,
  LocationToHeading,
  LocationToText,
  RowFive,
  RowFiveInnerContainer1,
  RowFiveInnerContainer2,
  AddressContainer,
  AddressContainer1,
  AddressContainer2,
} from '../Home/style';

import {ImageIconContainer} from './style';
import MapViewDirections from 'react-native-maps-directions';

import Geocoder from 'react-native-geocoder';
import Header from '../../components/Header';
import MapView, {Animated, PROVIDER_GOOGLE} from 'react-native-maps';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {relativeTimeRounding} from 'moment';
import {TestScheduler} from 'jest';
import {observe} from 'react-native/Libraries/LogBox/Data/LogBoxData';
import {add} from 'nodemon/lib/rules';

const MapScreen = ({navigation, route}) => {
  const [loc, setLoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resDataData, setResDataData] = useState([]);
  const [nextLocData, setNextLocData] = useState([]);
  const [rt, setRt] = useState(null);
  const [getAddress, setGetAddress] = useState([]);
  const [resSeqDataLength, setResSeqDataLength] = useState(0);
  const [resDataLength, setResDataLength] = useState(0);
  const [addMarker, setAddMarker] = useState(0);
  const [counter, setCounter] = useState(0);

  var rrtt = null;

  const styles = StyleSheet.create({});

  if (route.params != undefined) {
    rrtt = route.params.data;
  }

  useEffect(() => {
    // console.log('rrtt.....', rrtt);
    setRt(rrtt);
  }, [rrtt]);

  useEffect(() => {
    console.log('out asycn');
    AsyncStorage.getItem('loginData').then(data => {
      data = JSON.parse(data);
      axios(
        `https://pigeon-dev2.herokuapp.com/driver/driver-orders/${data['driverEmail']}/${data['driverId']}`,
      )
        .then(response => {
          setLoading(false);
          var fNxtLocData = [];
          if (
            response.data.data != undefined &&
            response.data.seqData != undefined
            ) {
              setResSeqDataLength(response.data.seqData.length);
              response.data.data.forEach((element, i, arr) => {
                var nxtLocData;
                if (element.status === 'New') {
                  nxtLocData = {
                    id: element.order_id,
                    status: element.status,
                    add: response.data.fromAddress[i],
                  };
                  fNxtLocData = [...fNxtLocData, nxtLocData];
                  setNextLocData(fNxtLocData);
                  nxtLocData = [];
                }
                if (i === arr.length - 1 && fNxtLocData.length === 0) {
                  setNextLocData([]);
                }
              });
              const ffAddLst = response.data.seqData;
              // console.log('in async...',response.data.seqData)
              // console.log('all set...',response.data.data);
            setLoc(ffAddLst);
            example(ffAddLst, response.data.data);
          }
        })
        .catch(err => {
          console.log('failed', err);
        });
    });
  }, [rt]);

  const example = async (add3, add2) => {
    if (add3.length > 0) {
      setLoc([]);
      for await (data of add3) {
        await Geocoder.geocodeAddress(data.address).then(geoData => {
          data.latitudeDelta = 0.1;
          data.longitudeDelta = 0.1;
          data.latitude = geoData[0].position.lat;
          data.longitude = geoData[0].position.lng;
          add2.forEach((data1, index1) => {
            if (data1['order_id'] == data['order_id']) {
              // console.log('ksbjxbwbxbwekcie',  data);
              data.status = data1['status'];
            }
          });
          return setLoc(a => [...a, data]);
        });
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View
        style={{
          flex: 1,
        }}>
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
            <MapView
              style={{flex: 1}}
              showsUserLocation
              initialRegion={{
                latitude: 43.95829792238706,
                latitudeDelta: 0.9914616693149441,
                longitude: -79.0264331549406,
                longitudeDelta: 1.527274623513236,
              }}>
              {loc.length === resSeqDataLength ? (
                <>
                  {(() => {
                    // console.log('hello times');
                    var fromCounter = 0;
                    var counterAnim = 0;

                    return loc.map((marker1, index1) => {
                      // console.log('mieninri.....',loc);
                      var mark = {
                        latitude: marker1['latitude'],
                        latitudeDelta: marker1['latitudeDelta'],
                        longitude: marker1['longitude'],
                        longitudeDelta: marker1['longitudeDelta'],
                      };

                      if (
                        marker1['delivery_type'] == 'Pick Up' &&
                        marker1['status'] == 'New' &&
                        counterAnim == 0
                      ) {
                        console.log('first....', index1);
                        counterAnim = 1;
                        fromCounter = 1;
                        return (
                          <MapView.Marker key={index1} coordinate={mark}>
                            <Animatable.Image
                              animation="flipOutY"
                              iterationCount="infinite"
                              direction="alternate"
                              source={require('../../image/markerblue.png')}
                              style={{
                                width: WIDTH * 0.094,
                                height: HEIGHT * 0.077,
                              }}
                            />
                          </MapView.Marker>
                        );
                      }

                      if (
                        marker1['delivery_type'] == 'Pick Up' &&
                        marker1['status'] != 'New'
                      ) {
                        console.log('second....', index1);
                        return (
                          <MapView.Marker key={index1} coordinate={mark}>
                            <Image
                              source={require('../../image/markerblue.png')}
                              style={{
                                width: WIDTH * 0.074,
                                height: HEIGHT * 0.057,
                              }}
                            />
                          </MapView.Marker>
                        );
                      }
                      if (
                        marker1['delivery_type'] == 'Pick Up' &&
                        marker1['status'] == 'New' &&
                        counterAnim == 1
                      ) {
                        console.log('second....', index1);
                        return (
                          <MapView.Marker key={index1} coordinate={mark}>
                            <Image
                              source={require('../../image/markerblue.png')}
                              style={{
                                width: WIDTH * 0.074,
                                height: HEIGHT * 0.057,
                              }}
                            />
                          </MapView.Marker>
                        );
                      }

                      if (
                        marker1['delivery_type'] == 'Drop Off' &&
                        (marker1['status'] == 'picked-up' ||
                          marker1['status'] == 'in-transit') &&
                        counterAnim == 0
                      ) {
                        counterAnim = 1;
                        return (
                          <MapView.Marker key={index1} coordinate={mark}>
                            <Animatable.Image
                              animation="flipOutY"
                              iterationCount="infinite"
                              direction="alternate"
                              source={require('../../image/markergreen.png')}
                              style={{
                                width: WIDTH * 0.094,
                                height: HEIGHT * 0.077,
                              }}
                            />
                          </MapView.Marker>
                        );
                      }

                      if (
                        marker1['delivery_type'] == 'Drop Off' 
                        && counterAnim == 1
                        && (marker1['status'] == 'delivered' || marker1['status'] == 'New')
                      ) {
                        // console.log('bcjdbcjkbdsic...',marker1['status'])
                        return (
                          <MapView.Marker key={index1} coordinate={mark}>
                            <Image
                              source={require('../../image/markergreen.png')}
                              style={{
                                width: WIDTH * 0.074,
                                height: HEIGHT * 0.057,
                              }}
                            />
                          </MapView.Marker>
                        );
                      }
                      if (
                        marker1['delivery_type'] == 'Drop Off' 
                        && counterAnim == 0
                        && (marker1['status'] == 'delivered' || marker1['status'] == 'New')
                      ) {
                        // console.log('bcjdbcjkbdsic...',marker1['status'])
                        return (
                          <MapView.Marker key={index1} coordinate={mark}>
                            <Image
                              source={require('../../image/markergreen.png')}
                              style={{
                                width: WIDTH * 0.074,
                                height: HEIGHT * 0.057,
                              }}
                            />
                          </MapView.Marker>
                        );
                      }

                      if (
                        marker1['delivery_type'] == 'Drop Off' &&
                        (marker1['status'] == 'picked-up' ||
                          marker1['status'] == 'in-transit') &&
                        counterAnim == 1
                      ) {
                        return (
                          <MapView.Marker key={index1} coordinate={mark}>
                            <Image
                              source={require('../../image/markergreen.png')}
                              style={{
                                width: WIDTH * 0.074,
                                height: HEIGHT * 0.057,
                              }}
                            />
                          </MapView.Marker>
                        );
                      }
                    });
                  })()}

                  {(() => {
                    // console.log('hello times2');
                    return loc.map((item, i, arr) => {
                      if (i < arr.length - 1) {
                        // console.log('bhjcbvsjdbcj....');
                        return (
                          <MapViewDirections
                            key={i}
                            origin={{
                              latitude: arr[i].latitude,
                              longitude: arr[i].longitude,
                            }}
                            destination={{
                              latitude: arr[i + 1].latitude,
                              longitude: arr[i + 1].longitude,
                            }}
                            apikey={'AIzaSyCvvrBY0CXghA-JKo7R0saGwj4Tl3uDAIo'}
                            strokeWidth={5}
                            strokeColor="hotpink"></MapViewDirections>
                        );
                      }
                    });
                  })()}
                </>
              ) : (
                <></>
              )}
            </MapView>

            {(nextLocData.length>0) ? (
              <View
                opacity={0.95}
                style={{
                  display: 'flex',
                  position: 'absolute',
                  backgroundColor: '#556ee1',
                  backgroundColor: '#556ee6',
                  width: WIDTH * 0.8,
                  height: 'auto',
                  top: HEIGHT * 0.1,
                  left: WIDTH * 0.05,
                  borderRadius: 15,
                  elevation: 7,
                  shadowColor: 'black',
                  padding: 15,
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Bold',
                      fontSize: 20,
                      color: 'white',
                    }}>
                    Next order to pick :{}
                  </Text>
                </View>
                <View>
                  <Separator />
                  <RowFive>
                    <RowFiveInnerContainer1>
                      <LocationToHeading
                        style={{color: 'white'}}
                        fontFamily="Poppins-SemiBold">
                        Order Id:
                      </LocationToHeading>
                    </RowFiveInnerContainer1>
                    <RowFiveInnerContainer2>
                      <LocationToText
                        fontFamily="Poppins-Regular"
                        style={{color: 'white'}}>
                        {nextLocData[0].id}
                        {/* {console.log('hello times3')} */}
                      </LocationToText>
                    </RowFiveInnerContainer2>
                  </RowFive>

                  <RowFiveLocation>
                    <RowFiveInnerContainer1Location>
                      <LocationToHeadingLocation
                        style={{color: 'white'}}
                        fontFamily="Poppins-SemiBold">
                        Location:
                      </LocationToHeadingLocation>
                    </RowFiveInnerContainer1Location>
                    <AddressContainer>
                      <AddressContainer1>
                        <Image
                          source={require('../../image/markergreen.png')}
                          style={{
                            width: WIDTH * 0.04,
                            height: HEIGHT * 0.03,
                            marginLeft: WIDTH * 0.03,
                            marginRight: WIDTH * 0.01,
                            tintColor: 'white',
                          }}
                        />
                      </AddressContainer1>
                      <AddressContainer2>
                        <LocationFromText
                          fontFamily="Poppins-Regular"
                          style={{color: 'white', width: '80%'}}>
                          {nextLocData[0].add}
                        </LocationFromText>
                      </AddressContainer2>
                    </AddressContainer>
                  </RowFiveLocation>
                </View>
              </View>
            ) : (
              <></>
            )}
            <HeaderContainer>
              <Header
                HeadingText="My Rides"
                navigation={navigation}
                showBackBTN={false}
              />
            </HeaderContainer>
            <ImageIconContainer onPress={() => navigation.navigate('Home')}>
              <Image
                source={require('../../image/mapIMGICON.png')}
                style={{}}
              />
            </ImageIconContainer>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;

// import React, {useState, useEffect} from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   View,
//   Text,
//   Image,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';

// import {HeaderContainer} from './style';

// import {
//   Separator,
//   RowFiveLocation,
//   RowFiveInnerContainer1Location,
//   LocationToHeadingLocation,
//   LocationFromText,
//   LocationToHeading,
//   LocationToText,
//   RowFive,
//   RowFiveInnerContainer1,
//   RowFiveInnerContainer2,
//   AddressContainer,
//   AddressContainer1,
//   AddressContainer2,
// } from '../Home/style';

// import {ImageIconContainer} from './style';
// import Geocoder from 'react-native-geocoder';
// import Header from '../../components/Header';
// import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
// const WIDTH = Dimensions.get('window').width;
// const HEIGHT = Dimensions.get('window').height;
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import NextDest from '../../components/NextDest';

// const MapScreen = ({navigation, route}) => {
//   const [region, setRegion] = useState([]);
//   const [region1, setRegion1] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [nextLocData, setNextLocData] = useState([]);
//   console.log(route);

//   useEffect(() => {
//     AsyncStorage.getItem('driverEmail').then(driverEmail => {
//       axios(
//         `https://pigeon-dev2.herokuapp.com/driver/driver-orders/${driverEmail}`,
//       )
//         .then(response => {
//           setLoading(false);
//           // console.log('responseresponseresponse', response.data.data[0].order_id);
//           response.data.data.forEach((element, i, arr) => {
//             console.log(
//               'element',
//               element.order_id,'....',
//               element.status,'....',
//               response.data.fromAddress[i],
//             );
//           });
//           // response.data.forEach((element, i, arr) => {
//           //   console.log(
//           //     'element',
//           //     element.order_id,
//           //     response.data.fromAddress[i],
//           //   );
//           // });

//           // console.log('from address', response.data.fromAddress);
//           // console.log('......................//////////', response);
//           // console.log('......................//////////', response.data.date_added);
//           // console.log('to address', response.data.toAddress);
//           example(response.data.fromAddress, response.data.toAddress);
//         })
//         .catch(err => {
//           console.log('failed', err);
//         });
//     });
//   }, []);

//   const example = async (add1, add2) => {
//     console.log('example add1', add1);

//     if (add1.length > 0 && add2.length > 0) {
//       for await (data of add1) {
//         console.log('data1', data);
//         await Geocoder.geocodeAddress(data).then(geoData => {
//           console.log('geoData1', geoData);
//           setRegion(prevState => [
//             ...prevState,
//             {
//               latitudeDelta: 0.1,
//               longitudeDelta: 0.1,
//               latitude: geoData[0].position.lat,
//               longitude: geoData[0].position.lng,
//             },
//           ]);
//         });
//       }

//       for await (data of add2) {
//         console.log('data2', data);
//         await Geocoder.geocodeAddress(data).then(geoData => {
//           console.log('geoData2', geoData);
//           setRegion1(prevState => [
//             ...prevState,
//             {
//               latitudeDelta: 0.1,
//               longitudeDelta: 0.1,
//               latitude: geoData[0].position.lat,
//               longitude: geoData[0].position.lng,
//             },
//           ]);
//         });
//       }
//     }
//   };

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//       }}>
//       <View
//         style={{
//           flex: 1,
//         }}>
//         {loading ? (
//           <ActivityIndicator
//             size="large"
//             color="blue"
//             style={{
//               flex: 1,
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           />
//         ) : (
//           <>
//             <MapView
//               style={{flex: 1}}
//               showsUserLocation
//               initialRegion={{
//                 latitude: 43.95829792238706,
//                 latitudeDelta: 0.9914616693149441,
//                 longitude: -79.0264331549406,
//                 longitudeDelta: 1.527274623513236,
//               }}>
//               {region.map((marker, index) => (
//                 <MapView.Marker key={index} coordinate={marker}>
//                   <Image
//                     source={require('../../image/markergreen.png')}
//                     style={{
//                       width: WIDTH * 0.074,
//                       height: HEIGHT * 0.057,
//                     }}
//                   />
//                 </MapView.Marker>
//               ))}

//               {region1.map((marker1, index1) => (
//                 <MapView.Marker key={index1} coordinate={marker1}>
//                   <Image
//                     source={require('../../image/markerblue.png')}
//                     style={{
//                       width: WIDTH * 0.074,
//                       height: HEIGHT * 0.057,
//                     }}
//                   />
//                 </MapView.Marker>
//               ))}
//             </MapView>
//             <View
//               opacity={0.85}
//               style={{
//                 display: 'flex',
//                 position: 'absolute',
//                 backgroundColor: '#556ee6',
//                 backgroundColor: '#7C99AC',
//                 width: WIDTH * 0.8,
//                 height: 'auto',
//                 top: HEIGHT * 0.13,
//                 left: WIDTH * 0.05,
//                 borderRadius: 10,
//                 elevation: 7,
//                 // shadowColor: '#556ee1',
//                 padding: 15,
//               }}>
//               <View>
//                 <Text style={{fontFamily: 'Poppins-Bold', fontSize: 17}}>
//                   Next order to pick :{}
//                 </Text>
//               </View>
//               <View>
//                 <Separator />
//                 <RowFive>
//                   <RowFiveInnerContainer1>
//                     <LocationToHeading fontFamily="Poppins-SemiBold">
//                       Order Id:
//                     </LocationToHeading>
//                   </RowFiveInnerContainer1>
//                   <RowFiveInnerContainer2>
//                     <LocationToText fontFamily="Poppins-Regular">
//                       {/* {item.order_id} */}gascvxhs
//                     </LocationToText>
//                   </RowFiveInnerContainer2>
//                 </RowFive>

//                 <RowFiveLocation>
//                   <RowFiveInnerContainer1Location>
//                     <LocationToHeadingLocation fontFamily="Poppins-SemiBold">
//                       Location:
//                     </LocationToHeadingLocation>
//                   </RowFiveInnerContainer1Location>
//                   <AddressContainer>
//                     <AddressContainer1>
//                       <Image
//                         source={require('../../image/markergreen.png')}
//                         style={{
//                           width: WIDTH * 0.04,
//                           height: HEIGHT * 0.03,
//                           marginLeft: WIDTH * 0.03,
//                         }}
//                         tintColor="white"
//                       />
//                     </AddressContainer1>
//                     <AddressContainer2>
//                       <LocationFromText fontFamily="Poppins-Regular">
//                         {/* {item.from_order} */}
//                         ghghghg
//                       </LocationFromText>
//                     </AddressContainer2>
//                   </AddressContainer>
//                 </RowFiveLocation>
//               </View>
//             </View>
//             <HeaderContainer>
//               <Header
//                 HeadingText="My Rides"
//                 navigation={navigation}
//                 showBackBTN={false}
//               />
//             </HeaderContainer>

//             <ImageIconContainer onPress={() => navigation.navigate('Home')}>
//               <Image
//                 source={require('../../image/mapIMGICON.png')}
//                 style={{}}
//               />
//             </ImageIconContainer>
//           </>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({});

// export default MapScreen;

// map copy

// {dyRegion && (
//   <MapView
//     style={{flex: 1}}
//     showsUserLocation
//     initialRegion={{
//       latitude: 43.95829792238706,
//       latitudeDelta: 0.9914616693149441,
//       longitude: -79.0264331549406,
//       longitudeDelta: 1.527274623513236,
//     }}>
//     {region.map((marker, index) => {
//       // console.log('region....', region);
//       // console.log('dyregion....', dyRegion);

//       if (dyRegion.length === 2 * region.length)
//         // console.log('region....',region)
//         return (
//           <MapView.Marker key={index} coordinate={marker}>
//             {(() => {
//               if (
//                 index === 0 &&
//                 dyRegion[index] != undefined &&
//                 region[index].latitude === dyRegion[index].latitude
//               ) {
//                 console.log('first if....', index);
//                 return (
//                   <Animatable.Image
//                     animation="flipOutY"
//                     iterationCount="infinite"
//                     direction="alternate"
//                     source={require('../../image/markergreen.png')}
//                     style={{
//                       width: WIDTH * 0.074,
//                       height: HEIGHT * 0.057,
//                     }}
//                   />
//                 );
//               }
//               if (
//                 dyRegion[index] != undefined &&
//                 region[index].latitude != dyRegion[index.lattude]
//               ) {
//                 console.log('second if', index);
//                 return (
//                   <Image
//                     source={require('../../image/markergreen.png')}
//                     style={{
//                       width: WIDTH * 0.074,
//                       height: HEIGHT * 0.057,
//                     }}
//                   />
//                 );
//               }
//             })()}

//             {/* <Image
//         // animation="flipOutY" iterationCount='infinite' direction="alternate"
//           source={require('../../image/markergreen.png')}
//           style={{
//             width: WIDTH * 0.074,
//             height: HEIGHT * 0.057,
//           }}
//         /> */}
//           </MapView.Marker>
//         );
//     })}

//     {region1.map((marker1, index1) => {
//       return (
//         <MapView.Marker key={index1} coordinate={marker1}>
//           {
//             <Image
//               source={require('../../image/markerblue.png')}
//               style={{
//                 width: WIDTH * 0.074,
//                 height: HEIGHT * 0.057,
//               }}
//             />
//           }
//         </MapView.Marker>
//       );
//     })}
//     {nextLocData &&
//       dyRegion.map((item, i, arr) => {
//         // console.log('dyregionLength...', dyRegion.length);
//         // console.log('resSeqDataLength...', resSeqDataLength);
//         // console.log('nextLocData...', nextLocData.length);
//         // console.log('resDataLength...', resDataLength);
//         if (
//           dyRegion.length === resSeqDataLength
//           // && nextLocData.length === resDataLength
//         )
//           if (i < arr.length - 1) {
//             console.log('resSeqDataLength...', resSeqDataLength);
//             return (
//               <MapViewDirections
//                 key={i}
//                 origin={{
//                   latitude: arr[i].latitude,
//                   longitude: arr[i].longitude,
//                 }}
//                 destination={{
//                   latitude: arr[i + 1].latitude,
//                   longitude: arr[i + 1].longitude,
//                 }}
//                 apikey={'AIzaSyCvvrBY0CXghA-JKo7R0saGwj4Tl3uDAIo'}
//                 strokeWidth={5}
//                 strokeColor="hotpink"></MapViewDirections>
//             );
//           }
//       })}
//   </MapView>
// )}
