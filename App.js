import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native'

import DrawerNavigator from './js/navigation/DrawNavigator';


const App = () =>{
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}


export default App
