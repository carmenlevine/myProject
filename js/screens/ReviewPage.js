import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {View, StyleSheet, ScrollView, Text, TextInput, Button, Alert, TouchableOpacity, ToastAndroid} from 'react-native';

class ReviewPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
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

        const value = await AsyncStorage.getItem('@session_token');
        const location_id = parseInt(this.props.route.params.location_id);

        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + location_id + '/review', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
            reviewBody: JSON.stringify(toSend)
        })
        .then((response) => {
            if (response.status === 201) {
                return response.json()
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
            ToastAndroid.show(JSON.stringify(eror), ToastAndroid.SHORT);
        });
    }

    addTO(){
        this.addReview();
        this.props.navigation.navigate('Home');
    }

    render(){

        const navigation = this.props.navigation;
        
        if (this.state.isLoading){
            return(
                <View style={styles.container}>
                    <Text style={styles.title}>Loading...</Text>
                </View>
            );
        }else{
            return(
               <ScrollView style={styles.container}>
                   <Text style={styles.header}>Create a new review</Text>
                   <View style={styles.review}>
                       <Text style={styles.title}>Overall rating</Text>

                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Price rating</Text>

                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Quality rating</Text>
                       
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Cleanliness rating</Text>
                       
                   </View>

                   <TextInput
                   style={styles.revBody}
                   multiline={true}
                   label="Review"
                   onChangeText={(reviewBody) => this.setState({reviewBody})}
                   value={this.state.reviewBody}
                   />

                   <TouchableOpacity
                   style={styles.button}
                   accessibilityLabel="Add Review"
                   onPress={() => {
                       this.addTO();
                   }}
                   >Add Review
                   </TouchableOpacity>
               </ScrollView>
                );
        }
        
    }
}

const styles = StyleSheet.create({
    container: {
        padding:15,
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 'bold'
    },
    header: {
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold'
    },
    review: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 12
    },
    revBody: {
        paddingTop: 15
    },
    button: {
       padding: 25 
    }
});

export default ReviewPage;