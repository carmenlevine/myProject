import React, { Component } from 'react';
import { ScrollView, ToastAndroid, Text, TextInput, StyleSheet, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-ratings';

 class EditReview extends Component {
     constructor(props){
         super(props);

         this.state = {
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
        const locationId = this.props.route.params.location_id;
        const reviewId = this.props.route.params.review_id;

        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + locationId + '/review/' + reviewId, {
            method: 'patch',
              headers: {
                  'Content-Type': 'application/json',
                  'X-Authorization': value
            },
            body: JSON.stringify(to_send),
        })
        .then((response) => {
            if (response.status === 200){
                console.log(response);
            }else {
                throw 'Something went wrong';
            }
        })
        .then(async () => {
            console.log('Review updated');
            this.props.navigation.navigate('Home');
            ToastAndroid.show('Review updated successfully', ToastAndroid.SHORT);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render(){
        return(
            <ScrollView style={styles.container}>
                   <Text style={styles.header}>Update a review</Text>
                   <View style={styles.review}>
                       <Text style={styles.title}>Overall rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       onFinishRating={(overallRating) => this.setState({overallRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Price rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       onFinishRating={(priceRating) => this.setState({priceRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Quality rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
                       onFinishRating={(qualityRating) => this.setState({qualityRating})}
                       />
                   </View>

                   <View style={styles.review}>
                       <Text style={styles.title}>Cleanliness rating</Text>
                       <AirbnbRating
                       selectedColor={'#FFD700'}
                       size={20}
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
                    onPress={() => this.props.navigation.navigate("Home")}
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
