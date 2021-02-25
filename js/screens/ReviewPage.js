import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {View, StyleSheet, ScrollView, Text, TextInput, Button, Alert, TouchableOpacity, ToastAndroid} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

class ReviewPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            overallRating: null,
            priceRating: null,
            qualityRating: null,
            clenlinessRating: null,
            reviewBody: ''
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus',() => {
            this.checkLoggedIn();
        });
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null){
            this.props.navigation.navigate("Login");
        }
    }

    addReview = async () => {
        const toSend = {
            overall_rating: parseInt(this.state.overallRating),
            price_rating: parseInt(this.state.priceRating),
            quality_rating: parseInt(this.state.qualityRating),
            clenliness_rating: parseInt(this.state.clenlinessRating),
            review_body: parseInt(this.state.reviewBody)
        }

        console.log(toSend);

        const value = await AsyncStorage.getItem('@session_token');
        const location_id = parseInt(this.props.route.params.location_id);
        console.log(value, location_id);

        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + location_id + '/review', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value,
            },
            reviewBody: JSON.stringify(toSend)
        })
        .then((response) => {
            if (response.status === 201) {
                return response.json();
            }else if(response.status === 401){
                throw 'Failed validation';
            }else {
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            console.log('Review created');
            this.props.navigation.navigate('Home');
        })
        .catch((error) => {
            console.log((error));
        });
    }

    addTO(){
        this.addReview();
        this.props.navigation.navigate('Home');
    }

    render(){

        const navigation = this.props.navigation;
    
            return(
               <ScrollView style={styles.container}>
                   <Text style={styles.header}>Create a new review</Text>
                   <View style={styles.review}>
                       <Text style={styles.title}>Overall rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       onFinishRating={(overallRating) => this.setState({overallRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Price rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       onFinishRating={(priceRating) => this.setState({priceRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Quality rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       onFinishRating={(qualityRating) => this.setState({qualityRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Cleanliness rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       onFinishRating={(clenlinessRating) => this.setState({clenlinessRating})}
                       />
                   </View>

                   <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Review</Text>
                   <TextInput
                   placeholder="Write a review"
                   style={styles.revBody}
                   multiline={true}
                //    mode="outlined"
                //    label="Review"
                   onChangeText={(reviewBody) => this.setState({reviewBody})}
                   value={this.state.reviewBody}
                   />
                   </View>

                   <TouchableOpacity
                   style={styles.formTouch}
                   onPress={() => {this.addTO()}}
                   >
                       <Text style={styles.formTouchText}>Add Review</Text>
                   </TouchableOpacity>
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
    }
});

export default ReviewPage;
