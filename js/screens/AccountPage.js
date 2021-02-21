import React, { Component } from 'react';
import {View, StyleSheet, Text, IconButton} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Account extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            listData: [],
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.loggedIn();
        });
        
        this.getData();
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    loggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null){
            this.props.navigation.navigate('Login');
        }
    }

    getData = async () => {
        const id = await AsyncStorage.getItem('@id');
        const user_id = parseInt(id);
        const value = await AsyncStorage.getItem('@session_token');

        return fetch('http://10.0.2.2:3333/api/1.o.o/user/' + user_id, {
            headers: {
                ID: user_id,
                'X-Authorization': value,
            },
        })
        .then((response) => {
            if(response.status === 200){
                return response.json();
            } else if (response.status === 401){
                throw 'You are not logged in';
                this.props.navigation.navigate('Login');
            } else {
                throw 'Something went wrong';
            }
        })
        .then((response) => {
            this.setState({
                isLoading: false,
                listData: response,
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render(){
        const {email, password} = this.state;

        const navigation = this.props.navigation;

        if(this.state.isLoading){
            return(
                <View style={styles.container}>
                    <Text style={styles.title}>Loading account...</Text>
                </View>
            );
        } else {
            return(
                <ScrollView
            contentContainerStyle={{flex:1, justifyContent:'center'}}
            >
                    <Text style={styles.title}>Hello {this.state.listData.firstName}</Text>
                    
                    <IconButton icon ='account-cog' size={22} onPress={() => this.props.navigation.navigate('EditAccountPage', {
                        item: this.state.listData
                    })} />

                </ScrollView>
            )
        }
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
    }
});

export default Account;
