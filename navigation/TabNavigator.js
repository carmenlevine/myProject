import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/HomeScreen';

const Tab = createBottomTabNavigator();

const bottomTabNavigator = () => {
    return (
        <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name = "HomeScreen" component={Home} />
          <Tab.Screen name = "Account" component={AccountPage}/>
          <Tab.Screen name = "Reviews" component={ReviewPage}/>
        </Tab.Navigator>
        </NavigationContainer>
      );
};

export default bottomTabNavigator;
