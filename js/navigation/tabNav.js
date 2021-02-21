import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons';

import Account from '../screens/AccountPage';
import Review from '../screens/ReviewPage';
import HomeScreen from '../components/HomeScreen';

const Tab = createBottomTabNavigator();

class tabNav extends Component {
    render() {
        return (
            <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Account') {
                        iconName = focused ? 'account' : 'account-outline';
                    } else if (route.name === 'Reviews') {
                        iconName = focused ? 'network' : 'network-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;

                },

            })}

            tabBarOptions={{
                activeTintColor: '#73F0E3',
                inactiveTintColor: '#7384FF',
            }}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Account" component={Account} />
                <Tab.Screen name="Reviews" component={Review} />
            </Tab.Navigator>
        );
    }
}

export default tabNav;
