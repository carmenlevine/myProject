import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class GetIndiLocInfo extends Component {
    constructor(props){
        super(props);

        this.state = {
            locationData: [],
            locationInfo: ''
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });

        this.getIndiLocationInfo();
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

    getIndiLocationInfo = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const location_id = await AsyncStorage.getItem('@location_id');

        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + + location_id, {
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
                locationData: responseJson
            });
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
                    <FlatList 
                    data={this.state.locationData.location_reviews}
                    renderItem={({item}) => (
                        <View style={styles.formItem}>
                            <Text>{item.location_name}</Text>
                            <Text>{item.location_town}</Text>
                            <Text>Latitude: {item.latitude}</Text>
                            <Text>Longitude: {item.longitude}</Text>
                            <Text style={styles.header}>Average Ratings</Text>
                            <Text>Overall: </Text>
                            <Text>Price: {item.avg_price_rating}</Text>
                            <Text>Quality: {item.avg_quality_rating}</Text>
                            <Text>Cleanliness: {item.avg_clenliness_rating}</Text>
                            <Text>{item.review_body}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => item.review_id.toString()}
                    />
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
    }
});

export default GetIndiLocInfo;
