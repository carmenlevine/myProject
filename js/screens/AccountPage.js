import React, { Component } from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView, ToastAndroid, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Account extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            firstName: '',
            lastName: '',
            email: '',
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getData();
        });
        
        
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    // checkLoggedIn = async () => {
    //     const value = await AsyncStorage.getItem('@session_token');
    //     if (value == null){
    //         this.props.navigation.navigate('Login');
    //     }
    // }

    getData = async () => {
        const id = await AsyncStorage.getItem('@user_id');
        const userId = JSON.parse(id);
        const value = await AsyncStorage.getItem('@session_token');

        return fetch('http://10.0.2.2:3333/api/1.o.o/user/' + userId, {
            headers: {
                'Content-type': 'application/json',
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
                firstName: responseJson.first_name,
                lastName: responseJson.last_name,
                email: responseJson.email
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render(){
        const navigation = this.props.navigation;

            return(
                <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.AccTitle}>My Account</Text>

                    <Text style={styles.title}>Hello {this.state.firstName}</Text>
                    
                    <Text style={styles.formText}>First name: {this.state.firstName}</Text>
                    <Text style={styles.formText}>Surname: {this.state.lastName}</Text>
                    <Text style={styles.formText}>Email: {this.state.email}</Text>

                    <View style={styles.formItem}>
                        <TouchableOpacity
                        style={styles.formTouch}
                        onPress={() => this.props.navigation.navigate('EditAccount')}
                        >
                            <Text style={styles.formTouchText}>Edit account</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
                </View>
            )
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
    }
});

export default Account;
