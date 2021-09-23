import React from "react";
import { Dimensions, Image, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { HomeStackNavigator } from "./StackNavigator";
import { MyridesStackNavigator } from "./StackNavigator";

import Profile from "../screens/Profile";
import MyRides from "../screens/MyRides";
import Logout from "../screens/Logout";

const Tab = createBottomTabNavigator();
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export const SettingBottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home1"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: Platform.OS === "ios" ? HEIGHT * 0.095 : HEIGHT * 0.073,
          paddingBottom: Platform.OS === "ios" ? HEIGHT * 0.034 : HEIGHT * 0.01,
        },
      }}
    >
      <Tab.Screen
        name="Home1"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Image
                source={require("../image/HomeActiveIcon.png")}
                color={color}
                style={styles.ICON_IMG}
              />
            ) : (
              <Image
                source={require("../image/HomeIcon.png")}
                color={color}
                style={styles.ICON_IMG}
              />
            ),
        }}
        component={HomeStackNavigator}
      />

      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Image
                source={require("../image/ActiveprofileIcon.png")}
                color={color}
                style={styles.ICON_IMG}
              />
            ) : (
              <Image
                source={require("../image/PROFILEICON.png")}
                color={color}
                style={styles.ICON_IMG}
              />
            ),
        }}
        component={Profile}
      />
      <Tab.Screen
        name="MyRides1"
        options={{
          headerShown: false,
          tabBarLabel: "My Rides",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Image
                source={require("../image/ActiveCycleImg.png")}
                color={color}
                style={styles.ICON_IMG}
              />
            ) : (
              <Image
                source={require("../image/CYCLEICON.png")}
                color={color}
                style={styles.ICON_IMG}
              />
            ),
        }}
        component={MyridesStackNavigator}
      />
      <Tab.Screen
        name="Logout"
        options={{
          headerShown: false,
          tabBarLabel: "Logout",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Image
                source={require("../image/ActiveLogout.png")}
                color={color}
                style={styles.ICON_IMG}
              />
            ) : (
              <Image
                source={require("../image/LOGOUTICON.png")}
                color={color}
                style={styles.ICON_IMG}
              />
            ),
        }}
        component={Logout}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  ICON_IMG: {
    marginTop: HEIGHT * 0.02,
  },
});
