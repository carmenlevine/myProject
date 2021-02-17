import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {View, StyleSheet, ScrollView, Text, TextInput, Button, Alert, TouchableOpacity} from 'react-native';

class AccountPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
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

    render(){

        if (this.state.isLoading){
            return(
                <View
                style={{
                    flex:1,
                    flexDirection:'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text>Loading...</Text>
                </View>
            );
        }else{
            return(
                <View>
                    <Text>Account Page</Text>
                </View>
                );
        }
        
    }
}

export default AccountPage;
