import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Reviews extends Component {
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
            }
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
        })
        .catch((error) => {
            console.log(error);
        });
    }

    componentDidMount(){
        this.getLocationInfo();
    }

    addReview = async () => {
        await AsyncStorage.setItem('@location_id', locationInfo+'');
        //this.props.navigation.navigate('ReviewStack');
    }

    render(){
        return(
            <View>
                <FlatList 
                data={this.state.locationData}
                renderItem={({item}) => (
                    <View>
                        <Text>{item.location_name}</Text>
                        <TouchableOpacity
                        onPress={() => this.addReview(item.location_id)}
                        title="Add a Review"
                        />
                        </View>
                )}
                keyExtractor={(item, index) => item.id}
                />
            </View>
        );
    }
}

export default Reviews;
