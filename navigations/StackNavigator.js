import React from "react";
import { Dimensions,Platform } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "../screens/MapScreen";
import Home from '../screens/Home'
import OrderDetails from '../screens/OrderDetails'
import MyRides from '../screens/MyRides'
import PickedUp from '../screens/PickedUp'
import Delivered from '../screens/Delivered'

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const Stack = createStackNavigator();

const screenOptionStyle = {
    headerStyle: {
        backgroundColor: "#FFFFFF",
    },
    headerTintColor: "black",
    headerBackTitle: "Back",  
    headerTitleStyle:{
     marginLeft: Platform.OS==='ios'? 0 :WIDTH * 0.2
    }
};

export const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="MapScreen">
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export const MyridesStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="MyRides">
      <Stack.Screen name="MyRides" component={MyRides} options={{ headerShown: false }}/>
      <Stack.Screen name="PickedUp" component={PickedUp} options={{ headerShown: false }}/>
      <Stack.Screen name="Delivered" component={Delivered} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};
