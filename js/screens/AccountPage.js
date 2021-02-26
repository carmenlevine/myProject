import React, { Component } from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView, ToastAndroid, LogBox} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.']);

class Account extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            listData: [],
        }
    }

    componentDidMount(){
            this.getData();
       
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null){
            this.getData();
        } else {
            this.props.navigation.navigate("Login");
        }
    }

    getData = async () => {
        const id = await AsyncStorage.getItem('@user_id');
        const value = await AsyncStorage.getItem('@session_token');

        console.log(id, value);

        return fetch('http://10.0.2.2:3333/api/1.o.o/user/' + id, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value,
            },
        })
        .then((response) => {
            if(response.status === 200){
                return response.json();
            } else if (response.status === 401){
                ToastAndroid.show('You are not logged in', ToastAndroid.SHORT);
                this.props.navigation.navigate('Login');
            } else if(response.status === 404) {
                throw 'Not found';
            } else if(response.status === 500){
                throw 'Server error';
            } else {
                throw 'Something else';
            }
        })
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                listData: responseJson,
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    deleteReview = async (locationId, reviewId) => {
        const value = await AsyncStorage.getItem('@session_token');

        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + locationId + '/review' + reviewId, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json();
            } else if(response.status === 401){
                throw 'You need to log in first';
            } else {
                throw 'Something went wrong';
            }
        })
        .then(async () => {
            this.getData();
            console.log('Review deleted');
            ToastAndroid.show('Review deleted', ToastAndroid.SHORT);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render(){
        const navigation = this.props.navigation;

            return(
                <View style={styles.formItem}>
                <ScrollView>
                    <Text style={styles.AccTitle}>My Account</Text> 
                    {/* prints out user info */}
                    <Text style={styles.formText}>First name: {this.state.listData.first_name}</Text>
                    <Text style={styles.formText}>Surname: {this.state.listData.last_name}</Text>
                    <Text style={styles.formText}>Email: {this.state.listData.email}</Text>

                    <View style={styles.formItem}>
                        <TouchableOpacity
                        style={styles.formTouch}
                        onPress={() => this.props.navigation.navigate('EditAccount')}
                        >
                            <Text style={styles.formTouchText}>Edit account</Text>
                        </TouchableOpacity>
                    </View>

                    {/* prints out all reviews from user */}
                    <Text style={styles.formText}>My Reviews: </Text>
                    <FlatList
                    style={styles.formItem}
                    data={this.state.listData.reviews}
                    renderItem={({item}) => (
                            <View style={styles.container}>
                                <Text>{item.location.location_name}</Text>
                                <Text>{item.location.location_town}</Text>
                                <Text>Overall Rating: {item.review.overall_rating}</Text>
                                <Text>Price Rating: {item.review.price_rating}</Text>
                                <Text>Cleanliness Rating: {item.review.clenliness_rating}</Text>
                                <Text>Quality Rating: {item.review.quality_rating}</Text>
                                <Text>{item.review.review_body}</Text>
                            </View>  
                    )}
                    keyExtractor={(item) => item.review.review_id.toString()}
                    />
                    <View style={styles.formItem}>
                    <TouchableOpacity
                    style={styles.formTouch}
                    onPress={() => this.props.navigation.navigate('EditReview',
                    {locationId: item.location.location_id, reviewId: item.review.review_id}
                    )}>
                        <Text style={styles.formTouchText}>Edit review</Text>
                    </TouchableOpacity>
                    </View>

                    <View style={styles.formItem}>
                        <TouchableOpacity
                        style={styles.formCancelTouch}
                        onPress={() => this.deleteReview()}
                        >
                            <Text style={styles.formCancelTouchText}>Delete review</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
               </View>
            );
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
        fontSize: 28,
        fontWeight: 'bold'
    },
    AccTitle: {
        fontSize:26,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    formText: { 
        fontSize: 18,
        textAlign:'left'
    },
    formItem: {
        padding:20
    },
    formTouch: {
    backgroundColor:'lightblue',
    padding:10,
    alignItems:'center'
    },
    formTouchText: {
    fontSize:20,
    fontWeight:'bold',
    color:'steelblue'
    },
    row: {
    flex:1,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row'
    },
    formCancelTouch: {
    backgroundColor: 'red',
    padding:10,
    alignItems: 'center'
    },
    formCancelTouchText: {
    fontSize:15,
    fontWeight: 'bold',
    color:'black'
    }
});

export default Account;
