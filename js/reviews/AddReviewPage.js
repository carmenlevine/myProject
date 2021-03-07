import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, ToastAndroid} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

//This page forms the code in order to create a new review for a pre-chosen location, which will then present on the view reviews screen.

class AddReviewPage extends Component {
    constructor(props){ 
        super(props);

        this.state = {
            //Variables that the review can be put into, including the stars added for each rating and the review body
            overallRating: null,
            priceRating: null,
            qualityRating: null,
            clenlinessRating: null,
            reviewBody: ''
        }
    }



    addReview = async () => {
        // This function takes the user input and sends it to the server in order to create a new review, that is added for the chosen
        //location and added to the list of reviews for the logged in user.
            const toSend = {
                //The request sent to the server includes to star ratings passed as an integer and the review body
                overall_rating: parseInt(this.state.overallRating),
                price_rating: parseInt(this.state.priceRating),
                quality_rating: parseInt(this.state.qualityRating),
                clenliness_rating: parseInt(this.state.clenlinessRating),
                review_body: this.state.reviewBody
            }
            //get the session token and location id in order to perform the request
                const value = await AsyncStorage.getItem('@session_token');
                const location_id = await AsyncStorage.getItem('@location_id');
                console.log(value, location_id, toSend); 

                return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + '/review', {
                 method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': value,
                 },
                body: JSON.stringify(toSend), //body of request sent to the server
                })
            .then((response) => {
                if (response.status === 201) {
                    ToastAndroid.show('Review created', ToastAndroid.SHORT);
                    this.props.navigation.navigate('ViewReviews');
                }else if(response.status === 401){
                    throw 'You must log in first';
                }else if(response === 400){
                    throw 'Bad request';
                } else if(response === 404){
                    throw 'Not found';
                } else {
                 throw 'Something went wrong';
                }
            })
            .catch((error) => {
                console.log((error));
            })
    }

    render(){

        const navigation = this.props.navigation;
    
            return(
               <ScrollView style={styles.container}>
                   <Text style={styles.header}>Create a new review</Text>
                   {/* Each of the following rating values includes the code to create the air bnb star rating
                   and assigns the number of stars out of 5 given to the value of the variable. Default rating is set to 5. */}
                   <View style={styles.review}>
                       <Text style={styles.title}>Overall rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       defaultRating={5}
                       onFinishRating={(overallRating) => this.setState({overallRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Price rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       defaultRating={5}
                       onFinishRating={(priceRating) => this.setState({priceRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Quality rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       defaultRating={5}
                       onFinishRating={(qualityRating) => this.setState({qualityRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Cleanliness rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       defaultRating={5}
                       onFinishRating={(clenlinessRating) => this.setState({clenlinessRating})}
                       />
                   </View>

                   <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Review</Text>
                   <TextInput
                   //review body where the user input text is set as the variable
                   placeholder="Write a review"
                   style={styles.revBody}
                   multiline={true}
                   onChangeText={(reviewBody) => this.setState({reviewBody})}
                   value={this.state.reviewBody}
                   />
                   </View>
 
                   <View style={styles.formItem}>
                   <TouchableOpacity
                   //button that calls the add a review function when clicked and navigates to the view all reviews page
                   style={styles.formTouch}
                   onPress={() => {this.addReview()}}
                   >
                       <Text style={styles.formTouchText}>Add Review</Text>
                   </TouchableOpacity>
                   </View>

                   <View style={styles.formItem}>
                    <TouchableOpacity
                    //cancel button that navigates back to the view all reviews page
                    style={styles.formCancelTouch}
                    onPress={() => this.props.navigation.navigate("ViewReviews")}
                    >
                    <Text style={styles.formCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    </View>
               </ScrollView>
                );
        }
        
    }

const styles = StyleSheet.create({
    container: { 
        padding:15,
        flex: 1
    },
    title: {
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    header: {
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 'bold'
    },
    formLabel: {
        fontSize:15,
        color:'steelblue'
    },
    review: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 12
    },
    revBody: {
        borderWidth:1,
        borderRadius:5,
        borderColor: 'lightblue'
    },
    formTouch: {
        backgroundColor: 'lightblue',
        padding:10,
        alignItems: 'center'
    },
    formTouchText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'steelblue'
    },
    formItem: {
        padding:20
    },
    formCancelTouch: {
        backgroundColor: 'red',
        padding:10,
        alignItems: 'center'
      },
    formCancelText: {
        fontSize:15,
        fontWeight: 'bold',
        color:'black'
      }
});

export default AddReviewPage;
