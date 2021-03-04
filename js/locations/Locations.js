import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Locations extends Component{
    constructor(props){
        super(props);

        this.state = {
            locationData: [],
            locationInfo: ''
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
                locationData: responseJson
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    componentDidMount(){
        this.getLocationInfo();
    }

    render(){
        return(
            <ScrollView>
                <View style={styles.formItem}>
                    <Text style={styles.formTitle}>Coffee Locations</Text>
                </View>
                <FlatList 
                data={this.state.locationData}
                renderItem={({item}) => (
                    <View style={styles.formItem}>
                        <Text>{item.location_name}</Text>
                        <TouchableOpacity 
                        style={styles.formTouch}
                        onPress={() => this.props.navigate('GetIndiLocInfo')}
                        />
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
    formTitle: {
       fontSize: 30,
       fontWeight: 'bold'
    }
});

export default Locations;
