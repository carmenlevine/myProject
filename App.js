import 'react-native-gesture-handler';
 
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';

import CreateAccount from './js/logIn/CreateAccount';
import Login from "./js/logIn/Login";   
import DrawNav from './js/navigation/DrawNavigator';

//This page includes the stack navigation used to initally log into the application, by having the log in, create account and draw nav pages in
// a stack navigator. When logged in, the log in function will navigate to the Draw Nav function, whose primary page is the homepage.
 
const Stack = createStackNavigator();

class App extends Component {  
  render(){ 
    return (
      <NavigationContainer>  
        <Stack.Navigator
        //Header is not shown and the log in page is presented as the first page when opening the application, because it is possible to 
        //navigate to the other pages from here with the necessary information
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
  