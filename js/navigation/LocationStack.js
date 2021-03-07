import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Import each required pages and stack navigation
import GetLocations from '../locations/Locations';
import GetIndiLocations from '../locations/GetIndiLocInfo';

//This page includes the navigation for the loction pages, using stack navigation so the pages can move freely within eachother without having
//to include both in the draw nav. The two pages included are the view all locations page and the view all reviews for a paritular location.
const Stack = createStackNavigator();

class LocationStack extends Component {
    render(){
        return(
            <Stack.Navigator
            //Header is not shown to look more professional and the main screen is set to the view all locations screen so that a location
            //can then be selected to go to view all the reviews for that chosen location.
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
