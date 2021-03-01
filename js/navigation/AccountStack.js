import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Account from '../user/AccountPage';
import EditAccount from '../user/EditAccountPage';

const Stack = createStackNavigator();

class AccountStack extends Component {
    render(){
        return(
            <Stack.Navigator
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