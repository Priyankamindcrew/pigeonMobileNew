import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import Splash from "./screens/Splash";
import DriverLogin from "./screens/DriverLogin";
import ForgotPass from "./screens/ForgotPass";
import { SettingBottomTabs } from "./navigations/TabNavigator";

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            options={{ headerShown: false }}
            name="Splash"
            component={Splash}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="DriverLogin"
            component={DriverLogin}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ForgotPass"
            component={ForgotPass}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="SettingBottomTabs"
            component={SettingBottomTabs}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({});

export default App;
