import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AddReview from '../reviews/AddReviewPage';
import EditReview from '../reviews/EditReview';
import CreateReview from '../reviews/Reviews';
import ViewReviews from '../reviews/ViewReviews';
import Locations from '../locations/FindLocations';

const Stack = createStackNavigator();

class ReviewStack extends Component {
    render(){
        return(
            <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="ViewReviews"
            >
                <Stack.Screen name="ViewReviews" component={ViewReviews} />
                <Stack.Screen name="FindLocations" component={Locations} />
                <Stack.Screen name="CreateReview" component={CreateReview} />
                <Stack.Screen name="EditReview" component={EditReview} />
                <Stack.Screen name="AddReview" component={AddReview} />

            </Stack.Navigator>
        );
    }
}

export default ReviewStack;
