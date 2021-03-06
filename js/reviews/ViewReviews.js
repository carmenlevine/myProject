import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ToastAndroid, FlatList, StyleSheet, ScrollView, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.']);

class ViewReviews extends Component {

    constructor(props){
        super(props);

        this.state = {
            listData: [],
            isLiked: false
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
        const id = await AsyncStorage.getItem('@id');
        const user_id = parseInt(id);
        const value = await AsyncStorage.getItem('@session_token');

        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + user_id, {
            method: 'get',
            headers: {
                ID: user_id,
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
            console.log(responseJson.reviews);
            this.setState({
                listData: responseJson.reviews
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    like = async() => {
        const value = await AsyncStorage.getItem('@session_token');
        const location_id = await AsyncStorage.getItem('@location_id');
        const review_id = this.props.route.params.item.review.review_id;

        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + '/review/' + review_id + '/like', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
        })
        .then((response) => {
            if (response.status === 200){
                this.setState({ isLiked: true });
                ToastAndroid.show('Review liked', ToastAndroid.SHORT);
                return response.json();
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
        const value = await AsyncStorage.getItem('@session_token');
        const location_id = await AsyncStorage.getItem('@location_id');
        const review_id = this.props.route.params.item.review.review_id;

        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + '/review/' + review_id + '/like', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            }
        })
        .then((response) => {
            if (response.status === 200){
                this.setState({ isLiked: false});
                ToastAndroid.show('Review unliked', ToastAndroid.SHORT);
                return response.json();
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
                    style={styles.formAddRevTouch}
                    onPress={() => this.props.navigation.navigate('CreateReview')}
                    >
                        <Text style={styles.formAddRevText}>Add a new review</Text>
                    </TouchableOpacity>
                </View>

                <FlatList 
                data={this.state.listData}
                renderItem={({item}) => (
                    <View style={styles.flatlistContainer}> 
                    <Text style={styles.locName}>{item.location.location_name}</Text>
                    
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
                        style={styles.formLike}
                        onPress={() => this.like()}
                        >
                            <Text style={styles.formLikeText}>Like review</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formItem}>
                        <TouchableOpacity
                        style={styles.formUnlike}
                        onPress={() => this.unlike()}
                        >
                            <Text style={styles.formLikeText}>Unlike review</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formItem}>
                        <TouchableOpacity
                        style={styles.formTouch}
                        onPress={() => this.props.navigation.navigate('EditReview', {
                            location_id: item.location.location_id, 
                            review_id: item.review.review_id
                        })}
                        >
                            <Text style={styles.formTouchText}>Edit Review</Text>
                        </TouchableOpacity>

                    </View>
                    </View>
                )}
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
