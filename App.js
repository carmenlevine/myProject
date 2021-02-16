import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack';
import bottomTabNavigator from "./navigation/TabNavigator";

import Home from './components/HomeScreen';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

class App extends Component{
  render(){
    return(
      <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name = "Login" component={Login} />
      <Stack.Screen name = "HomeScreen" component={Home} />
      <Stack.Screen name= "CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
    </NavigationContainer>
    );
  }

  

}


export default App
