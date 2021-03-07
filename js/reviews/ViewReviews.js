import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ToastAndroid, FlatList, StyleSheet, ScrollView, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//This page prints all the reviews made by the logged in user, showing the review and the location it is for.
//This page also allows the user to like and unlike their reviews and create a new review.

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.']);

class ViewReviews extends Component {

    constructor(props){
        super(props);

        this.state = {
            listData: [], //response data will be stored here for use in printing the data and getting the values
            isLiked: false //value will be used to assign likes or remove likes from a review
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
        if (value == null){
            this.props.navigation.navigate('Login');
        }
    }

    getData = async () => {
        //This function uses a get request to collect the data from the user, and then specifies it wants the review data
        //get user id and session token from async storage
        const id = await AsyncStorage.getItem('@id');
        const value = await AsyncStorage.getItem('@session_token');

        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + id, {
            method: 'get',
            headers: {
                //authorise with session token and user id
                ID: id,
                'X-Authorization': value
            },
        })
        .then((response) => {
            if(response.status === 200){
                return response.json();
            } else if (response.status === 401){
                throw 'You must log in first';
            }else if(response === 400){
                throw 'Bad request';
            } else if(response === 404){
                throw 'Not found';
            } else {
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            this.setState({
                //specify we want the review data regarding the user and assign it to the value of listData
                listData: responseJson.reviews
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    like = async () => {
        //This function uses a post request to add a like to a chosen review for a specified location
        const value = await AsyncStorage.getItem('@session_token');
        //get the location and review id's for the chosen review
        const location_id = this.state.location_id;
        const review_id = this.state.review_id;

        console.log(review_id);

        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + '/review/' + review_id + '/like', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
        })
        .then((response) => {
            if (response.status === 200){
                this.setState({ isLiked: true }); //set is liked to true so a like is added to the review
                ToastAndroid.show('Review liked', ToastAndroid.SHORT);
            } else if (response.status === 400){
                throw 'Bad request';
            } else if (response.status === 401){
                throw 'You must log in first';
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

    unlike = async () => {
        //This function uses a delete request to remove a like from a review for a specific location
        const value = await AsyncStorage.getItem('@session_token');
        //retriebe location and review ids
        const location_id = this.state.location_id;
        const review_id = this.state.review_id;

        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + '/review/' + review_id + '/like', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            }
        })
        .then((response) => {
            if (response.status === 200){
                this.setState({ isLiked: false}); // sets value to false, so a like is removed from the review
                ToastAndroid.show('Review unliked', ToastAndroid.SHORT);
            } else if (response.status === 400){
                throw 'Bad request';
            } else if (response.status === 401){
                throw 'You must log in first';
            } else if (response.status === 404){
                throw 'Not found';
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
            <ScrollView>
                <Text style={styles.title}>My Reviews</Text>

                <View style={styles.formItem}>
                    <TouchableOpacity
                    //button links to the create a review page so a new review can be added
                    style={styles.formAddRevTouch}
                    onPress={() => this.props.navigation.navigate('CreateReview')}
                    >
                        <Text style={styles.formAddRevText}>Add a new review</Text>
                    </TouchableOpacity>
                </View>

                <FlatList 
                //Flatlist prints each review as a single item, with all ratings and review body included, as well as the name and review
                //id. Also includes the like, unlike and edit review buttons for each item in the flatlist.
                data={this.state.listData}
                renderItem={({item}) => (
                    <View style={styles.flatlistContainer}> 
                    <Text style={styles.locName}>{item.location.location_name}</Text>
                    <Text>{item.review.review_id}</Text>
                    
                    <View style={styles.formReview}>
                        <Text style={styles.reviewText}>Overall Rating: {item.review.overall_rating}</Text>
                        </View>

                    <View style={styles.formReview}>
                        <Text style={styles.reviewText}>Price Rating: {item.review.price_rating}</Text>
                        </View>

                    <View style={styles.formReview}>
                        <Text style={styles.reviewText}>Quality Rating: {item.review.quality_rating}</Text>
                        </View>

                    <View style={styles.formReview}>
                        <Text style={styles.reviewText}>Cleanliness Rating: {item.review.clenliness_rating}</Text>
                        </View>

                    <View style={styles.formReview}>
                        <Text style={styles.reviewText}>{item.review.review_body}</Text>
                        </View>

                    <View style={styles.formItem}>
                        <Text>Likes: {item.review.likes}</Text>
                    </View>

                    <View style={styles.formItem}>
                        <TouchableOpacity
                        //button assigns the values of location and review id, as well as calling the like function, so a like is added
                        style={styles.formLike}
                        onPress={() => {
                            this.like(),
                            this.setState({
                            location_id: item.location.location_id,
                            review_id: item.review.review_id
                        })
                    }}>
                            <Text style={styles.formLikeText}>Like review</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formItem}>
                        <TouchableOpacity
                        //button assigns the values of location and review id, as well as calling the unlike function, so a like is removed
                        style={styles.formUnlike}
                        onPress={() => {
                            this.unlike(),
                            this.setState({
                                location_id: item.location.location_id,
                                review_id: item.review.review_id
                            })
                        }}>
                            <Text style={styles.formLikeText}>Unlike review</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formItem}>
                        <TouchableOpacity
                        //button assigns the values of location and review id, then navigates the user to the edit review page
                        style={styles.formTouch}
                        onPress={() => {
                            this.setState({
                                location_id: item.location.location_id,
                                review_id: item.review.review_id
                            })
                            this.props.navigation.navigate('EditReview')
                        }}>
                            <Text style={styles.formTouchText}>Edit Review</Text>
                        </TouchableOpacity>

                    </View>
                    </View>
                )}
                //Flatlist uses the review id to loop through the list and make each item unique
                keyExtractor={(item, index) => item.review.review_id.toString()}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 'bold'
    },
    flatlistContainer: {
        padding: 15,
        flex: 1,
        justifyContent: 'center'
    },
    locName: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 5
    },
    formReview: {
        flexDirection: 'row'
    },
    reviewText: {
         fontSize: 18,
         padding: 5
    },
    formItem: {
        padding: 8
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
    formLike: {
        backgroundColor: 'lightgreen',
        padding: 5
    },
    formLikeText: {
        fontSize: 15,
    },
    formUnlike: {
        backgroundColor: 'orangered',
        padding: 5
    },
    formAddRevTouch: {
        backgroundColor: 'yellow',
        padding:10,
    },
    formAddRevText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    }

});

export default ViewReviews;
