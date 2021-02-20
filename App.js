import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DrawerNavigator from './js/components/DrawNavigator';
import CreateAccountPage from './js/components/CreateAccount'; 
import LoginPage from './js/components/Login';

const stack = createStackNavigator();

class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <stack.Navigator
        options={{headerShown: false}}
        initalRouteName="Login">
          <stack.Screen name = "Login" component={LoginPage} />
          <stack.Screen name = "Createaccount" component={CreateAccountPage} />
          <stack.Screen name = "DrawNav" component={DrawerNavigator} />
          </stack.Navigator>
      </NavigationContainer>
    )
  };
}

 export default App;
