import React, { Component } from 'react';
import { Text, View, TouchableOpacity, LogBox, FlatList, StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//This page prints a list of the different locations available to write a review on in a flatlist. So that the user can click
//their preferred location and are navigated to write a review on that specific location.

LogBox.ignoreLogs(['Warning: Each child in a list should have a unique "key" prop.']);

class Reviews extends Component {
    constructor(props){
        super(props);

        this.state = {
            locationData: [], //response data will be stored here
            locationInfo: ''
        }
    }

    getLocationInfo = async () => {
        //This function uses a get request to get all the locations available to write a review on using the /find url
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://10.0.2.2:3333/api/1.0.0/find/", {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value //authorisation using session token
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
            this.setState({locationData: responseJson}); 
            //assign the result of the list of locations to the locationdata variable
        })
        .catch((error) => {
            console.log(error);
        });
    }

    componentDidMount(){
        this.getLocationInfo();
    }

    addReview = async (locationInfo) => {
        //When called, set the location ID and information and navigate to the add review page, so that a review can be created
        //for the specified location using async storage
        await AsyncStorage.setItem('@location_id', locationInfo+'');
        this.props.navigation.navigate('AddReview');
    }

    render(){
        return(
            <ScrollView>
                <FlatList 
                //flatlist prints the locations including the name of the location followed by the add review button
                data={this.state.locationData}
                renderItem={({item}) => (
                    <View style={styles.formItem}>
                        <Text style={styles.headers}>{item.location_name}</Text>
                        <TouchableOpacity
                        //when clicked, call the add review function and pass it the location id of the chosen location
                        style={styles.formTouch}
                        onPress={() => this.addReview(item.location_id)}
                        >
                        <Text style={styles.formTouchText}>Add a review</Text>
                        </TouchableOpacity>
                        </View>
                )}
                keyExtractor={(item, index) => item.id}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formItem: {
        padding: 20
    },
    headers: {
        fontWeight: 'bold',
        fontSize: 30
    },
    formTouch: {
        backgroundColor: 'lightblue',
        padding:25,
        alignItems: 'center'
    },
    formTouchText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'steelblue'
    }
});

export default Reviews;
