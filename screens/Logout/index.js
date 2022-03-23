import React, { useEffect } from "react";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast, { DURATION } from "react-native-easy-toast";
import { Dimensions, View, Text } from "react-native";

export default function Logout({ navigation }) {
  useEffect(async () => {
    try {
      await AsyncStorage.removeItem('loginData');
      console.log("Done");
      navigation.replace("DriverLogin");
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Logout Screen</Text>
      <Toast
        position="center"
        ref={(ref) => {
          blanktoast = ref;
        }}
        style={{ backgroundColor: "black" }}
      />
    </View>
  );
}
