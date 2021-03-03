import React, { Component } from 'react';
import { ScrollView, ToastAndroid, Text, TextInput, StyleSheet, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-ratings';

 class EditReview extends Component {
     constructor(props){
         super(props);

         this.state = {
            // locationData: [],
            // locationInfo: '',
            overallRating: null,
            priceRating: null,
            qualityRating: null,
            clenlinessRating: null,
            reviewBody: ''
         }
     }

     componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus',() => {
            this.checkLoggedIn();
        });
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null){
            this.props.navigation.navigate("Login");
        }
    }

    editReview = async () => {
        let to_send = {
            overallRating: parseInt(this.state.overall_rating),
            priceRating: parseInt(this.state.price_rating),
            qualityRating: parseInt(this.state.quality_rating),
            clenlinessRating: parseInt(this.state.clenliness_rating),
            reviewBody: this.state.review_body
        }

        const value = await AsyncStorage.getItem('@session_token');
        const location_id = await AsyncStorage.getItem('@location_id');
        const review_id = this.props.route.params.review_id;

        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + location_id + '/review/' + review_id, {
            method: 'patch',
            headers: {
                  'Content-Type': 'application/json',
                  'X-Authorization': value
            },
            body: JSON.stringify(to_send),
        })
        .then((response) => {
            if (response.status === 200){
                return response.json();
            }else if (response.status === 401){
                throw 'You must log in first';
            } else if (response === 400){
                throw 'Bad request';
            } else if (response === 404){
                throw 'Not found';
            } else {
                throw 'Something went wrong';
            }
        })
        .then((response) => {
            console.log('Review updated');
            ToastAndroid.show('Review updated', ToastAndroid.SHORT);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    deleteReview = async () => {
        const to_send = {
            overallRating: parseInt(this.state.overall_rating),
            priceRating: parseInt(this.state.price_rating),
            qualityRating: parseInt(this.state.quality_rating),
            clenlinessRating: parseInt(this.state.clenliness_rating),
            reviewBody: this.state.review_body
        }

        const value = await AsyncStorage.getItem('@session_token');
        const location_id = await AsyncStorage.getItem('@location_id');
        const review_id = this.props.route.params.item.review.review_id;

        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + location_id + '/review/' + review_id, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
            body: JSON.stringify(to_send),
        })
        .then((response) => {
            if(response.status === 200){
                ToastAndroid.show('Review deleted', ToastAndroid.SHORT);
                return response.json();
            }else if (response.status === 401){
                throw 'You must log in first';
            } else if (response === 400){
                throw 'Bad request';
            } else if (response === 404){
                throw 'Not found';
            } else {
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
            console.log(responseJson);
            this.props.navigation.navigate('ViewReviews');
        })
        .catch((error) => {
            console.log(error);
        });
    }

    deleteButton() {
        this.deleteReview();
        this.props.navigation.navigate('ViewReviews');
    }

    render(){
        const navigation = this.props.navigation;

        return(
            <ScrollView style={styles.container}>
                   <Text style={styles.header}>Update a review</Text>
                   <View style={styles.review}>
                       <Text style={styles.title}>Overall rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       defaultRating={this.props.route.params.item.review.overall_rating}
                       onFinishRating={(overallRating) => this.setState({overallRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Price rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       defaultRating={this.props.route.params.item.review.price_rating}
                       onFinishRating={(priceRating) => this.setState({priceRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Quality rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       defaultRating={this.props.route.params.item.review.quality_rating}
                       onFinishRating={(qualityRating) => this.setState({qualityRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Cleanliness rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       defaultRating={this.props.route.params.item.review.clenliness_rating}
                       onFinishRating={(clenlinessRating) => this.setState({clenlinessRating})}
                       />
                   </View>

                   <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Review</Text>
                   <TextInput
                   placeholder="Write a review"
                   style={styles.revBody}
                   multiline={true}
                   onChangeText={(reviewBody) => this.setState({reviewBody})}
                   value={this.state.reviewBody}
                   />
                   </View>

                   <TouchableOpacity
                   style={styles.formTouch}
                   onPress={() => {this.editReview()}}
                   >
                       <Text style={styles.formTouchText}>Edit Review</Text>
                   </TouchableOpacity>

                   <View style={styles.formItem}>
                        <TouchableOpacity
                        style={styles.formCancelTouch}
                        onPress={() => this.deleteReview()}
                        >
                            <Text style={styles.formCancelTouchText}>Delete review</Text>
                        </TouchableOpacity>
                    </View>

                   <View style={styles.formItem}>
                    <TouchableOpacity
                    style={styles.formCancelTouch}
                    onPress={() => this.props.navigation.navigate("ViewReviews")}
                    >
                    <Text style={styles.formCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    </View>
               </ScrollView>
        );
    }

 }

 const styles = StyleSheet.create({
    formCancelTouch: {
        backgroundColor: 'red',
        padding:10,
        alignItems: 'center'
      },
      formCancelText: {
        fontSize:15,
        fontWeight: 'bold',
        color:'black'
      },
      title: {
        color:'steelblue',
        backgroundColor:'lightblue',
        padding:10,
        fontSize:25
      },
      formItem: {
        padding:20
      },
      formInput: {
        borderWidth:1,
        borderColor: 'lightblue',
        borderRadius:5
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
      container: {
        padding:15,
        flex: 1,
    },
    title: {
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 'bold'
    }
 })

 export default EditReview;
