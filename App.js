import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './js/components/HomeScreen';
import CreateAccountPage from './js/components/CreateAccount';
import LoginPage from './js/components/Login';
import AccountPage from './js/screens/AccountPage';
import ReviewPage from './js/screens/ReviewPage';

const Draw = createDrawerNavigator();

class App extends Component{
  render(){
    return(
      <NavigationContainer>
       <Draw.Navigator>
          <Draw.Screen name = "Home" component={HomeScreen} />
          <Draw.Screen name = "Create an account" component={CreateAccountPage} />
          <Draw.Screen name = "Login" component={LoginPage} />
          <Draw.Screen name = "My account" component={AccountPage} />
          <Draw.Screen name = "My Reviews" component={ReviewPage} />
        </Draw.Navigator>
    </NavigationContainer>
    );
  }
}


export default App
