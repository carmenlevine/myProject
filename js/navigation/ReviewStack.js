import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//import all required screens and stack navigation
import AddReview from '../reviews/AddReviewPage';
import EditReview from '../reviews/EditReview';
import CreateReview from '../reviews/Reviews';
import ViewReviews from '../reviews/ViewReviews';

const Stack = createStackNavigator();

//This page includes the navigation for the review pages, via use of stack navigation. The pages included are view all reviews from the
//user, create a new review, edit a review and choose a location in which to create a new review for.

class ReviewStack extends Component {
    render(){
        return(
            <Stack.Navigator
            //Header is not shown and the main screen is set to the view all reviews screen. It is possible to navigate from each
            //of the following screens using the buttons and functions included on each of the pages included in the stack navigator.
            screenOptions={{headerShown: false}}
            initialRouteName="ViewReviews"
            >
                <Stack.Screen name="ViewReviews" component={ViewReviews} />
                <Stack.Screen name="CreateReview" component={CreateReview} />
                <Stack.Screen name="EditReview" component={EditReview} />
                <Stack.Screen name="AddReview" component={AddReview} />

            </Stack.Navigator>
        );
    }
}

export default ReviewStack;
