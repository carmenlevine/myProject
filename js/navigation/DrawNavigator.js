import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../components/HomeScreen';
import CreateAccountPage from '../components/CreateAccount';
import LoginPage from '../components/Login';
import AccountPage from '../screens/AccountPage';
import ReviewPage from '../screens/ReviewPage';
import LogoutPage from '../components/Logout';

const Draw = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Draw.Navigator>
            <Draw.Screen name="Login" component={LoginPage} />
            <Draw.Screen name="Home" component={HomeScreen} />
            <Draw.Screen name="Create an account" component={CreateAccountPage} />
            <Draw.Screen name="Logout" component={LogoutPage}/>
            <Draw.Screen name="My account" component={AccountPage} />
            <Draw.Screen name="My Reviews" component={ReviewPage} />
        </Draw.Navigator>
    );
}

export default DrawerNavigator;
