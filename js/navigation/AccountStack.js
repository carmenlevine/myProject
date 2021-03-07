import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//import all required screens
import Account from '../user/AccountPage';
import EditAccount from '../user/EditAccountPage';

//This page includes the navigation for the account navigation. Here I have used stack navigation.
//The two pages included are the account and edit account screens. They can be navigated between so that
//only the account screen has to be shown in the draw navigator.

const Stack = createStackNavigator();

class AccountStack extends Component {
    render(){
        return(
            <Stack.Navigator
            //header is not shown to look more professional and the main screen is set to the account screen
            screenOptions={{headerShown: false}}
            initialRouteName="Account"
            >
                <Stack.Screen name="Account" component={Account} />
                <Stack.Screen name="EditAccount" component={EditAccount} />
            </Stack.Navigator>
        );
    }
}

export default AccountStack;
