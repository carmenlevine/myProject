import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Locations extends Component{
    constructor(props){
        super(props);

        this.state = {
            locationData: [],
            locationInfo: '',
            isFavourited: false
        }
    }

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
                locationData: responseJson,
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    favourite = async (location_id) => {
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
        await AsyncStorage.setItem('@location_id', locationInfo+'');
        this.props.navigation.navigate('GetIndiLocations');
    }

    render(){
        return(
            <View>
                <View style={styles.formItem}>
                    <Text style={styles.formTitle}>Coffee Locations</Text>
                </View>
                <FlatList 
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
                        style={styles.formTouch}
                        onPress={() => this.props.navigation.navigate('GetIndiLocations', {
                            location_id: item.location_id,
                        })}
                        />
                        <Text style={styles.formTouchText}>See all reviews</Text>

                        <View style={styles.formItem}>
                            <TouchableOpacity
                            style={styles.formFav}
                            onPress={() => this.favourite(item.location_id)}
                            >
                                <Text style={styles.formFavText}>Favourite location</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formItem}>
                            <TouchableOpacity
                            style={styles.formUnFav}
                            onPress={() => this.unfavourite(item.location_id)}
                            >
                                <Text style={styles.formFavText}>Unfavourite location</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}
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
       fontSize: 30,
       fontWeight: 'bold'
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
