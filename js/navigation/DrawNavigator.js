import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../components/HomeScreen';
import ReviewPage from '../screens/ReviewPage';
import LogoutPage from '../components/Logout';
import Login from '../components/Login';
import Account from '../navigation/AccountStack';
import EditReview from '../screens/EditReview';

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
    render() {
        return(
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Login" component={Login} /> 
                <Drawer.Screen name="Account" component={Account} />
                <Drawer.Screen name="Reviews" component={ReviewPage} />
                <Drawer.Screen name="EditReview" component={EditReview} />
                <Drawer.Screen name="Logout" component={LogoutPage} />
            </Drawer.Navigator>
        );
    }
}

export default DrawerNavigator;
