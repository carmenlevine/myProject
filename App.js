import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack';

import Home from './components/HomeScreen';
import CreateAccount from './components/CreateAccount';

const Stack = createStackNavigator();

class App extends Component{
  render(){
    return(
      <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name = "HomeScreen" component={Home} />
      <Stack.Screen name= "CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
    </NavigationContainer>
    );
  }

  
}


export default App