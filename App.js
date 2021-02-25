import 'react-native-gesture-handler';
 
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CreateAccount from './js/components/CreateAccount';
import Login from "./js/components/Login";
import DrawNav from './js/navigation/DrawNavigator';

const Stack = createStackNavigator();

class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name ="Home" component={DrawNav} />
        </Stack.Navigator>
      </NavigationContainer>
    );  
  }
}

 export default App;
