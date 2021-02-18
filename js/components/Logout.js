import React, { Component } from 'react';
import {ToastAndroid, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LogoutPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true
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
    };

    logout = async () => {

        return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
                throw 'You are not logged in';
            } else {
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
            this.setState({
                isLoading:false
            });
            console.log(responseJson);
            await AsyncStorage.removeItem('@session_token', responseJson.token);
            this.props.navigation.navigate("Login");
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(JSON.stringify(error).ToastAndroid.SHORT);
        })
    }

    render (){
        return(
            <View>
                <Text style={styles.title}>Log out</Text>

                <View style={styles.formItem}>
                    <TouchableOpacity
                    style={styles.formTouch}
                    onPress={() => this.logout()}
                    >
                        <Text style={styles.formTouchText}>Log out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        color:'steelblue',
        backgroundColor:'lightblue',
        padding:10,
        fontSize:25
    },
    formItem: {
        padding:20,
        alignItems:'center',
        alignSelf:'center'
    },
    formTouch: {
        backgroundColor: 'lightblue',
        padding:10,
        alignItems: 'center'
    },
    formTouchText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'steelblue'
    }
})

export default LogoutPage;
