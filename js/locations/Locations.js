import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Locations extends Component{
    constructor(props){
        super(props);

        this.state = {
            locationData: [], //information retrieved from request will be stored here
            locationInfo: '',
            isFavourited: false //value to assign whether the location is favourited or not
        }
    }

    //perform the get info function if mounted correctly and logged in
    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        })
        this.getLocationInfo(); 
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null){
            this.props.navigation.navigate('Login');
        }
    }

    getLocationInfo = async () => {
        //this function uses a get request to find all the locations available, and information regarding each of them
        const value = await AsyncStorage.getItem('@session_token');

        return fetch("http://10.0.2.2:3333/api/1.0.0/find/", {
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
                locationData: responseJson, //set the response of the request into the locationdata value to it can be used
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    favourite = async (location_id) => {
        //this function uses a post request to allow the user to favourite a specific location
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/favourite", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
        })
        .then((response) => {
            if (response.status === 200){
                this.setState({ isFavourited: true }); 
                //sets the value of isfavourited to true so that the location is added to a list of favourite locations for this user
                ToastAndroid.show('Location favourited', ToastAndroid.SHORT);
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

    unfavourite = async (location_id) => {
        //this function uses a delet request to allow the user to unfavourite a specific location from their list of favourites
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/favourite", {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
        })
        .then((response) => {
            if (response.status === 200){
                this.setState({ isFavourited: false });
                //sets the value of isfavourited to false so that the location is removed to a list of favourite locations for this user
                ToastAndroid.show('Location unfavourited', ToastAndroid.SHORT);
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

    getAllReviews = async (locationInfo) => {
        //function transports the user to the page that gets all reviews for a
        //specific location by passing the location ID and the location info inside the navigation function
        await AsyncStorage.setItem('@location_id', locationInfo+'');
        this.props.navigation.navigate('GetIndiLocations');
    }

    render(){
        return(
            <View>
                <View style={styles.formItem}>
                    <Text style={styles.formHeader}>Coffee Locations</Text>
                </View>
                <FlatList 
                //flatlist prints all the data regarding each specific location and each button as
                //an item including the average ratings from the reviews
                data={this.state.locationData}
                renderItem={({item}) => (
                    <View style={styles.formItem}>
                        <Text style ={styles.formTitle}>{item.location_name}</Text>
                        <Text>{item.location_town}</Text>
                        <Text>Overall Rating: {item.avg_overall_rating}</Text>
                        <Text>Price Rating: {item.avg_price_rating}</Text>
                        <Text>Quality Rating: {item.avg_quality_rating}</Text>
                        <Text>Cleanliness Rating: {item.avg_clenliness_rating}</Text>

                        <TouchableOpacity 
                        //navigates to the page to get all reviews from a location by choosing the wanted location and passing the location id
                        style={styles.formTouch}
                        onPress={() => this.props.navigation.navigate('GetIndiLocations', {
                            location_id: item.location_id,
                        })}
                        />
                        <Text style={styles.formTouchText}>See all reviews</Text>

                        <View style={styles.formItem}>
                            <TouchableOpacity
                            //button calls the favourite function, when pressed the location will be favourited for this user
                            style={styles.formFav}
                            onPress={() => this.favourite(item.location_id)}
                            >
                                <Text style={styles.formFavText}>Favourite location</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formItem}>
                            <TouchableOpacity
                            //button calls the unfavourite function, when pressed the location will be removed from this users favourites
                            style={styles.formUnFav}
                            onPress={() => this.unfavourite(item.location_id)}
                            >
                                <Text style={styles.formFavText}>Unfavourite location</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}
                //flatlist uses the location id variable to loop through to list, so each one is unique and can be identified
                keyExtractor={(item, index) => item.location_id.toString()}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    formItem: {
        padding: 20
    },
    formTitle: {
       fontSize: 25,
       fontWeight: 'bold'
    },
    formHeader: {
        fontSize: 34,
        fontWeight: 'bold',
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
    formFav: {
        backgroundColor: 'lightgreen',
        padding: 5
    },
    formFavText: {
        fontSize: 15,
    },
    formUnFav: {
        backgroundColor: 'orangered',
        padding: 5
    }
});

export default Locations;
