import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

 //import all required screens, as well as draw nav
import HomeScreen from '../logIn/HomeScreen';
import LogoutPage from '../logIn/Logout';
import Login from '../logIn/Login';
import Account from '../navigation/AccountStack';
import ViewReviews from '../navigation/ReviewStack';
import LocationStack from '../navigation/LocationStack';

//This page forms the main navigation for the application once the user is logged in. I have used a draw navigator that links to all the required
//pages of the application. The draw navigator links to the stack navigators. The names of each screen can be used in each page of the draw
//navigator to navigator to that particular page.
 
const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
    render() {
        return(
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Login" component={Login} /> 
                <Drawer.Screen name="Account" component={Account} />
                <Drawer.Screen name="Locations" component={LocationStack} />
                <Drawer.Screen name="ViewReviews" component={ViewReviews}/>
                <Drawer.Screen name="Logout" component={LogoutPage} />
            </Drawer.Navigator>
        );
    }
}

export default DrawerNavigator;
