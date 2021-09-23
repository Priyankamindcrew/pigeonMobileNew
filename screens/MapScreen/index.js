import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { HeaderContainer, ImageIconContainer } from "./style";
import Geocoder from "react-native-geocoder";
import Header from "../../components/Header";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const MapScreen = ({ navigation }) => {
  const [region, setRegion] = useState([]);
  const [region1, setRegion1] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("driverEmail").then((driverEmail) => {
      axios(`https://pigeon-dev2.herokuapp.com/driver/driver-orders/${driverEmail}`)
        .then((response) => {
          setLoading(false);
          console.log("responseresponseresponse", response);
          console.log("from address", response.data.fromAddress);
          console.log("to address", response.data.toAddress);
          example(response.data.fromAddress, response.data.toAddress);
        })
        .catch((err) => {
          console.log("failed", err);
        });
    });
  }, []);

  const example = async (add1, add2) => {
    console.log("example add1", add1);

    if (add1.length > 0 && add2.length > 0) {
      for await (data of add1) {
        console.log("data1", data);
        await Geocoder.geocodeAddress(data).then((geoData) => {
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

      for await (data of add2) {
        console.log("data2", data);
        await Geocoder.geocodeAddress(data).then((geoData) => {
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
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        {loading ? (
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
              style={{ flex: 1 }}
              showsUserLocation
              initialRegion={{
                latitude: 43.95829792238706,
                latitudeDelta: 0.9914616693149441,
                longitude: -79.0264331549406,
                longitudeDelta: 1.527274623513236,
              }}
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

              {region1.map((marker1, index1) => (
                <MapView.Marker key={index1} coordinate={marker1}>
                  <Image
                    source={require("../../image/markerblue.png")}
                    style={{
                      width: WIDTH * 0.074,
                      height: HEIGHT * 0.057,
                    }}
                  />
                </MapView.Marker>
              ))}
            </MapView>
            <HeaderContainer>
              <Header
                HeadingText="My Rides"
                navigation={navigation}
                showBackBTN={false}
              />
            </HeaderContainer>

            <ImageIconContainer onPress={() => navigation.navigate("Home")}>
              <Image
                source={require("../../image/mapIMGICON.png")}
                style={{}}
              />
            </ImageIconContainer>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default MapScreen;
