import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../logIn/HomeScreen';
import LogoutPage from '../logIn/Logout';
import Login from '../logIn/Login';
import Account from '../navigation/AccountStack';
import CreateReview from '../navigation/ReviewStack';
import Locations from '../locations/Locations';
import FindLocations from '../locations/FindLocations';
// import ViewReviews from '../reviews/ViewReviews';
 
const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
    render() {
        return(
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Login" component={Login} /> 
                <Drawer.Screen name="Account" component={Account} />
                <Drawer.Screen name="Locations" component={Locations} />
                <Drawer.Screen name="FindLocations" component={FindLocations} />
                <Drawer.Screen name="CreateReview" component={CreateReview}/>
                {/* <Drawer.Screen name="ViewReviews" component={ViewReviews} /> */}
                <Drawer.Screen name="Logout" component={LogoutPage} />
            </Drawer.Navigator>
        );
    }
}

export default DrawerNavigator;
