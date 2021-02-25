import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../components/HomeScreen';
import AccountPage from '../screens/AccountPage';
import ReviewPage from '../screens/ReviewPage';
import LogoutPage from '../components/Logout';
import Login from '../components/Login';
import EditAccount from '../screens/EditAccountPage';

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
    render() {
        return(
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Login" component={Login} /> 
                <Drawer.Screen name="Account" component={AccountPage} />
                <Drawer.Screen name="EditAccount" component={EditAccount} />
                <Drawer.Screen name="Reviews" component={ReviewPage} />
                <Drawer.Screen name="Logout" component={LogoutPage} />
            </Drawer.Navigator>
        );
    }
}

export default DrawerNavigator;
