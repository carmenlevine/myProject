import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AddReview from '../reviews/AddReviewPage';
import EditReview from '../reviews/EditReview';
import Review from '../reviews/Reviews';
import ViewReviews from '../reviews/ViewReviews';

const Stack = createStackNavigator();

class ReviewStack extends Component {
    render(){
        return(
            <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="ViewReviews"
            >
                <Stack.Screen name="ViewReviews" component={ViewReviews} />
                <Stack.Screen name="Review" component={Review} />
                <Stack.Screen name="EditReview" component={EditReview} />
                <Stack.Screen name="AddReview" component={AddReview} />

            </Stack.Navigator>
        );
    }
}

export default ReviewStack;
