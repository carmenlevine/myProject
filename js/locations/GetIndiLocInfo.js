import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class GetIndiLocInfo extends Component {
    constructor(props){
        super(props);

        this.state = {
            locationData: [],
            isLiked: false
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
                locationData: responseJson,
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    likeReview = async (review_id) => {
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
                this.setState({ isLiked: true });
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
                this.setState({ isLiked: false });
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
                        <TouchableOpacity 
                        //style={styles.like}
                        title='Like'
                        onPress={() => this.likeReview()}
                        />
                        <TouchableOpacity 
                        //style={styles.unlike}
                        title='Unlike'
                        onPress={() => this.unlikeReview()}
                        />
                    </View>
                )}
                keyExtractor={(item, index) => item.review_id.toString()}
                />
                <View style={styles.formItem}>
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
