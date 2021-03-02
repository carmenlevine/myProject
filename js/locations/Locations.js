import React, { Component } from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView, LogBox, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.']);

class Review extends Component {
    constructor(props){
        super(props);
    

    this.state = {
        isLoading: true,
        listData: [],
        isLiked: false,
    }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
        this.getData();
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value === null){
            this.props.navigation.navigate('Login');
        }
    }

    getData = async () => {
        const location_id = this.props.route.params.location_id;
        const value = await AsyncStorage.getItem('@session_token');

        console.log(location_id, value);


        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + location_id, {
            method: 'get',
            headers: {
                'X-Authorization': value,
            }
        })
        .then((response) => {
            if (response.status === 200){
                return response.json();
            } else if (response.status === 401){
                ToastAndroid.show('You are not logged in', ToastAndroid.SHORT);
                this.props.navigation.navigate('Login');
            }else if(response.status === 404) {
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
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }

    likeReview = async (review_id) => {
        const value = await AsyncStorage.getItem('@session_token');
        const location_id = this.props.route.params.location_id;
        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + location_id + '/review/' + review_id + '/like', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value,
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.setState({ likeReview: true });
                this.getData();
                ToastAndroid.show('Review Liked', ToastAndroid.SHORT);
                return response.json();
            } else if(response.status === 400){
                throw 'Failed Validation';
            } else {
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    unlikeReview = async (review_id) => {
        const value = await AsyncStorage.getItem('@session_token');
        const location_id = this.props.route.params.location_id;
        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + locatio_id + '/review/' + review_id + '/like', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value,
            }
        })
        .then((response) => {
            if (response.status === 200){
                this.setState({isLiked:false});
                ToastAndroid.show('Review Unliked', ToastAndroid.SHORT);
                return response.json();
            } else if (response.status === 400){
                throw 'Failed Validation';
            } else {
                throw 'Something went wrong';
            }
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
                    {/* prints out all reviews from user for a location*/}
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
                    {location_id: item.location.location_id, review_id: item.review.review_id}
                    )}>
                        <Text style={styles.formTouchText}>Edit review</Text>
                    </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    formItem: {
        padding:20
    },
    formText: { 
        fontSize: 18,
        textAlign:'left'
    },
    container: {
        padding:15,
        flex: 1,
        justifyContent: 'center'
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

export default Review;
