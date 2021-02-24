import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../components/HomeScreen';
import AccountPage from '../screens/AccountPage';
import ReviewPage from '../screens/ReviewPage';
import LogoutPage from '../components/Logout';

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
    render() {
        return(
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Account" component={AccountPage} />
                <Drawer.Screen name="Reviews" component={ReviewPage} />
                <Drawer.Screen name="Logout" component={LogoutPage} />
            </Drawer.Navigator>
        );
    }
}

export default DrawerNavigator;
