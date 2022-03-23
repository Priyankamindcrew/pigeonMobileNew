import React, { useState, useEffect, useRef } from "react";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import axios from "axios";
import {
  ScrollView,
  Text,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Container,
  HeaderContainer,
  DropdownContainer,
  DropdownBTN,
  DropdownText,
  DropdownBTNContentContainer,
  DropdownInnerContainerOne,
  ColumnOne,
  TextOne,
  ColumnTwo,
  TextTwo,
  DropDownBtnColumn1,
  DropDownBtnColumn2,
  DropDownBtnInner,
  DropdownText2,
  DropDownBtnColumnfirst,
  DropDownBtnColumnsecond,
  TakePictureBtnContainer,
  TakeButtonText,
  PicContainerOne,
  PicContainerTwo
} from "./style";
import MapView, { Marker } from "react-native-maps";
import Header from "../../components/Header";
import Geocoder from "react-native-geocoder";
import MapViewDirections from "react-native-maps-directions";
import moment from "moment";

export default function OrderDetails({ navigation, route }) {
  // console.log('./././././',route)
  const todayDate = new Date().toLocaleString("en-US", {
    timeZone: "America/Toronto",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  console.log("hello shubham your data through route are", route.params);
  const [date1, setDate1] = useState(moment(todayDate).format("DD/MM/YYYY"));
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [region, setRegion] = useState([]);
  const [region1, setRegion1] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    axios(`https://pigeon-dev2.herokuapp.com/driver/order-details/${route.params.driverEmail}/${route.params.orderId}`)
      .then((response) => {
        console.log("aaaaaa ", response.data);
        if (response.data.data === undefined) {
          setLoader(false);
          setEmpty("No orders found for today");
        } else {
          setLoader(false);
          console.log(
            "response.data=-=-=-=-=-=-==================>",
            response.data.dimentionData
          );
          setData(response.data.data);
          setDate(response.data.datetime);
          setPackageData(response.data.dimentionData);
          example(response.data.fromAddress, response.data.toAddress);
        }
      })
      .catch((err) => {
        console.log("failed", err);
      });
  }, []);

  const example = async (add1, add2) => {
    console.log("example add1", add1);

    if (add1.length > 0 && add2.length > 0) {
      for await (data1 of add1) {
        console.log("data1", data1);
        await Geocoder.geocodeAddress(data1).then((geoData) => {
          console.log("geoData1", geoData);
          setRegion((prevState) => [
            ...prevState,
            {
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
              latitude: geoData[0].position.lat,
              longitude: geoData[0].position.lng,
            },
          ]);
        });
      }

      for await (data1 of add2) {
        console.log("data2", data1);
        await Geocoder.geocodeAddress(data1).then((geoData) => {
          console.log("geoData2", geoData);
          setRegion1((prevState) => [
            ...prevState,
            {
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
              latitude: geoData[0].position.lat,
              longitude: geoData[0].position.lng,
            },
          ]);
        });
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Container>
        {loader ? (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        ) : (
          <>
            <MapView
              style={styles.mapStyle}
              zoomEnabled={true}
              region={{
                latitude: 43.95829792238706,
                latitudeDelta: 0.9914616693149441,
                longitude: -79.0264331549406,
                longitudeDelta: 1.527274623513236,
              }}
              onRegionChangeComplete={(region) =>
                console.log("regionnnn00000", region)
              }
            >
              {region.map((marker, index) => (
                <MapView.Marker key={index} coordinate={marker}>
                  <Image
                    source={require("../../image/markergreen.png")}
                    style={{
                      width: WIDTH * 0.074,
                      height: HEIGHT * 0.057,
                    }}
                  />
                </MapView.Marker>
              ))}

              {region1.map((marker, index) => (
                <MapView.Marker key={index} coordinate={marker}>
                  <Image
                    source={require("../../image/markerblue.png")}
                    style={{
                      width: WIDTH * 0.074,
                      height: HEIGHT * 0.057,
                    }}
                  />
                </MapView.Marker>
              ))}

              {region.map((item, index) => {
                return region1.map((item1, index1) => {
                  if (index === index1) {
                    return (
                      <MapViewDirections
                        key={index}
                        origin={{
                          latitude: item.latitude,
                          longitude: item.longitude,
                        }}
                        destination={{
                          latitude: item1.latitude,
                          longitude: item1.longitude,
                        }}
                        apikey={"AIzaSyCvvrBY0CXghA-JKo7R0saGwj4Tl3uDAIo"}
                        strokeWidth={5}
                        strokeColor="hotpink"
                      />
                    );
                  }
                });
              })}
            </MapView>

            <HeaderContainer>
              <Header
                HeadingText="My Rides"
                navigation={navigation}
                showBackBTN={true}
              />
            </HeaderContainer>

            {data.map((item, index) => (
              <DropdownContainer key={index}>
                <ScrollView
                  style={{
                    marginTop: 10,
                    marginBottom: 100,
                  }}
                >
                  <DropdownBTN>
                    <DropDownBtnInner>
                      <DropDownBtnColumnfirst>
                        <DropdownText fontFamily="Poppins-SemiBold">
                          Customer name:
                        </DropdownText>
                      </DropDownBtnColumnfirst>
                      <DropDownBtnColumnsecond>
                        <DropdownText2 fontFamily="Poppins-Medium">
                          {item.from_name}
                        </DropdownText2>
                      </DropDownBtnColumnsecond>
                    </DropDownBtnInner>
                  </DropdownBTN>
                  <DropdownBTN onPress={() => setShow(!show)}>
                    <DropDownBtnInner>
                      <DropDownBtnColumn1>
                        <DropdownText fontFamily="Poppins-SemiBold">
                          Package details
                        </DropdownText>
                      </DropDownBtnColumn1>
                      <DropDownBtnColumn2>
                        <Image source={require("../../image/downArrow.png")} />
                      </DropDownBtnColumn2>
                    </DropDownBtnInner>
                  </DropdownBTN>
                  {show ? (
                    <DropdownBTNContentContainer>
                      <DropdownInnerContainerOne>
                        <ColumnOne>
                          <TextOne>Package ID:</TextOne>
                        </ColumnOne>
                        <ColumnTwo>
                          <TextTwo>{item.order_id}</TextTwo>
                        </ColumnTwo>
                      </DropdownInnerContainerOne>
                      <DropdownInnerContainerOne>
                        <ColumnOne>
                          <TextOne>Delivery Date:</TextOne>
                        </ColumnOne>
                        <ColumnTwo>
                          <TextTwo>{item.delivery_date}</TextTwo>
                        </ColumnTwo>
                      </DropdownInnerContainerOne>

                      {packageData.map((ITEM, index3) => (
                        <DropdownInnerContainerOne key={index3}>
                          <ColumnOne>
                            <TextOne>Package{index3 + 1}:</TextOne>
                          </ColumnOne>
                          <ColumnTwo>
                            <TextTwo>dimensions: {ITEM.dimensions}</TextTwo>
                            <TextTwo>weight: {ITEM.weight}</TextTwo>
                          </ColumnTwo>
                        </DropdownInnerContainerOne>
                      ))}

                      <DropdownInnerContainerOne>
                        <ColumnOne>
                          <TextOne>Package is fragile:</TextOne>
                        </ColumnOne>
                        <ColumnTwo>
                          <TextTwo>{item.fragile}</TextTwo>
                        </ColumnTwo>
                      </DropdownInnerContainerOne>

                      {item.instruction ? (
                        <DropdownInnerContainerOne>
                          <ColumnOne>
                            <TextOne>Special Instruction:</TextOne>
                          </ColumnOne>
                          <ColumnTwo>
                            <TextTwo>{item.instruction}</TextTwo>
                          </ColumnTwo>
                        </DropdownInnerContainerOne>
                      ) : null}
                    </DropdownBTNContentContainer>
                  ) : null}
                  <DropdownBTN onPress={() => setShow1(!show1)}>
                    <DropDownBtnInner>
                      <DropDownBtnColumn1>
                        <DropdownText fontFamily="Poppins-SemiBold">
                          Location details
                        </DropdownText>
                      </DropDownBtnColumn1>
                      <DropDownBtnColumn2>
                        <Image source={require("../../image/downArrow.png")} />
                      </DropDownBtnColumn2>
                    </DropDownBtnInner>
                  </DropdownBTN>
                  {show1 ? (
                    <DropdownBTNContentContainer>
                      <DropdownInnerContainerOne>
                        <ColumnOne>
                          <TextOne>Pickup location:</TextOne>
                        </ColumnOne>
                        <ColumnTwo>
                          <TextTwo>{item.from_order}</TextTwo>
                        </ColumnTwo>
                      </DropdownInnerContainerOne>
                      <DropdownInnerContainerOne>
                        <ColumnOne>
                          <TextOne>Drop location:</TextOne>
                        </ColumnOne>
                        <ColumnTwo>
                          <TextTwo>{item.to_order}</TextTwo>
                        </ColumnTwo>
                      </DropdownInnerContainerOne>
                    </DropdownBTNContentContainer>
                  ) : null}
                  <DropdownBTN onPress={() => setShow2(!show2)}>
                    <DropDownBtnInner>
                      <DropDownBtnColumn1>
                        <DropdownText fontFamily="Poppins-SemiBold">
                          Status
                        </DropdownText>
                      </DropDownBtnColumn1>
                      <DropDownBtnColumn2>
                        <Image source={require("../../image/downArrow.png")} />
                      </DropDownBtnColumn2>
                    </DropDownBtnInner>
                  </DropdownBTN>
                  {show2 ? (
                    <DropdownBTNContentContainer>
                      <DropdownInnerContainerOne>
                        <ColumnOne>
                          <TextOne>{item.status}</TextOne>
                        </ColumnOne>
                      </DropdownInnerContainerOne>
                    </DropdownBTNContentContainer>
                  ) : null}
                  {/* <TakePictureBtnContainer>
                    <PicContainerOne>
                      <TakeButtonText>
                        Hello
                      </TakeButtonText>
                    </PicContainerOne>
                    <PicContainerTwo>
                      <Image />
                    </PicContainerTwo>
                  </TakePictureBtnContainer> */}
                </ScrollView>
              </DropdownContainer>
            ))}
          </>
        )}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: WIDTH,
    height: HEIGHT * 0.48,
  },
});
