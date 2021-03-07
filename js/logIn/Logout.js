import React, { Component } from 'react';
import {ToastAndroid, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//This page forms the logout page where the user can log out of their account and return to the log in page

class LogoutPage extends Component {

    logout = async () => {
        //this function uses a post request to log out of the app and navigate the user to the log in screen
        let value = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');

        return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value, //authorised using the session token from async storage
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate('Login');
            }else if(response.status === 401){
                ToastAndroid.show('You are not logged in', ToastAndroid.SHORT);
                this.props.navigation.navigate('Login');
            } else {
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render (){
        const navigation = this.props.navigation;

        return(
            <View>
                <Text style={styles.title}>Log out</Text>

                <View style={styles.formItem}>
                    <TouchableOpacity
                    //button that calls the log out function on press to navigate to the log in screen
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
    },
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
    }
})

export default LogoutPage;
