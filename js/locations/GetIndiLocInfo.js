import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//This page retrieves all the reviews for a specific location which was chosen on the Locations.js page.
//This includes reviews made by all users, not just the user logged in.

class GetIndiLocInfo extends Component {
    constructor(props){
        super(props);

        this.state = {
            locationData: [], //the information retrieved from the request will be stored here
            isLiked: false //value to set liked and unlike for reviews
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });

        this.getIndiLocationInfo(); //if logged in, perform the get info request
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null){
            this.props.navigation.navigate('Login'); //navigates to log in screen if the user is not logged in
        }
    }

    getIndiLocationInfo = async () => {
        //this get request retieves all the information for a specific location using the location ID
        const value = await AsyncStorage.getItem('@session_token');
        const location_id = this.props.route.params.location_id;
        console.log(location_id);

        return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+ location_id, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
        })
        .then((response) => {
            if (response.status === 200){
                return response.json();
            } else if (response.status === 401){
                ToastAndroid.show('You are not logged in', ToastAndroid.SHORT);
                this.props.navigation.navigate('Login');
            } else if (response.status === 404){
                throw 'Not found';
            } else {
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                locationData: responseJson, //stores the response in the locationdata variable, all info regarding specific location
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    likeReview = async (review_id) => {
        //this function uses a post request to add a like to a specific review for a specific location
        const value = await AsyncStorage.getItem('@session_token');
        const location_id = this.props.route.params.location_id;

        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id + "/like", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
        })
        .then((response) => {
            if (response.status === 200){
                this.setState({ isLiked: true }); //sets liked value to true so that the like will show as 1 more than before
                ToastAndroid.show("Review liked", ToastAndroid.SHORT);
                return response.json();
            } else if (response.status === 401){
                ToastAndroid.show('You are not logged in', ToastAndroid.SHORT);
                this.props.navigation.navigate('Login');
            } else if (response.status === 404){
                throw 'Not found';
            } else {
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    unlikeReview = async (review_id) => {
        //this function uses a delete request to remove a like from a specific review for a specific location
        const value = await AsyncStorage.getItem('@session_token');
        const location_id = this.props.route.params.location_id;

        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id + "/like", {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
        })
        .then((response) => {
            if (response.status === 200){
                this.setState({ isLiked: false }); //sets liked value to false so that the like will show as 1 less than before
                ToastAndroid.show("Review unliked", ToastAndroid.SHORT);
                return response.json();
            } else if (response.status === 401){
                ToastAndroid.show('You are not logged in', ToastAndroid.SHORT);
                this.props.navigation.navigate('Login');
            } else if (response.status === 404){
                throw 'Not found';
            } else {
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render(){

        const navigation = this.props.navigation;

        return(
            <ScrollView>
                <View style={styles.formItem}>
                <Text style={styles.header}>Location Information</Text>
                </View>

                {/* this flatlist shows each review in an item, by printing all the values,
                including the review body and all ratings, as well as the number of likes the review has recieved.*/}
                <FlatList 
                data={this.state.locationData.location_reviews}
                renderItem={({item}) => (
                    <View style={styles.formItem}>
                        <Text>{item.review_body}</Text>
                        <Text>Overall rating: {item.overall_rating}</Text>
                        <Text>Price rating: {item.price_rating}</Text>
                        <Text>Quality rating: {item.quality_rating}</Text>
                        <Text>Cleanliness rating: {item.clenliness_rating}</Text>
                        <Text>Likes: {item.likes}</Text>
                    </View>
                )}
                //use the review id to loop through the list of reviews for the location
                keyExtractor={(item, index) => item.review_id.toString()} 
                />
                <View style={styles.formItem}>
                    {/* button to move backwards to the previous page that shows all locations */}
                    <TouchableOpacity 
                    style={styles.formTouch}
                    onPress={() => this.props.navigation.navigate('GetLocations')}
                    >
                        <Text style={styles.formTouchText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formItem: {
        padding: 20
    },
    header: {
        fontWeight: 'bold',
        fontSize: 25
    },
    like: {
        backgroundColor: 'green'
    },
    unlike: {
        backgroundColor: 'red'
    },
    formTouch: {
      backgroundColor:'red',
      padding:10,
      alignItems:'center'
    },
    formTouchText: {
      fontSize:20,
      fontWeight:'bold',
      color:'black'
    }
});

export default GetIndiLocInfo;
