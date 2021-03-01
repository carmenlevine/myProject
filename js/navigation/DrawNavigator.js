import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../logIn/HomeScreen';
import LogoutPage from '../logIn/Logout';
import Login from '../logIn/Login';
import Account from '../navigation/AccountStack';
import Review from '../navigation/ReviewStack';

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
    render() {
        return(
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Login" component={Login} /> 
                <Drawer.Screen name="Account" component={Account} />
                <Drawer.Screen name="MyReviews" component={Review} />
                <Drawer.Screen name="Logout" component={LogoutPage} />
            </Drawer.Navigator>
        );
    }
}

export default DrawerNavigator;
