import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Review from '../reviews/Reviews';
import EditReview from '../reviews/EditReview';
import AddReview from '../reviews/AddReviewPage';

const Stack = createStackNavigator();

class ReviewStack extends Component {
    render(){
        return(
            <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="Review"
            >
                <Stack.Screen name="Review" component={Review} />
                <Stack.Screen name="EditReview" component={EditReview} />
                <Stack.Screen name="AddReview" component={AddReview} />

            </Stack.Navigator>
        );
    }
}

export default ReviewStack;
