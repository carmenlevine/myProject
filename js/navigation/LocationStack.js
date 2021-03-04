import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import GetLocations from '../locations/Locations';
import GetIndiLocations from '../locations/GetIndiLocInfo';

const Stack = createStackNavigator();

class LocationStack extends Component {
    render(){
        return(
            <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="GetLocations"
            >
                <Stack.Screen name="GetLocations" component={GetLocations} />
                <Stack.Screen name="GetIndiLocations" component={GetIndiLocations} />
            </Stack.Navigator>
        );
    }
}

export default LocationStack;
