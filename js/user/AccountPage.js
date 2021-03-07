import React, { Component } from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView, ToastAndroid, LogBox} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, TextInput } from 'react-native-gesture-handler';

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
            this.checkLoggedIn();
        });
        this.getData();
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value === null){
            this.props.navigation.navigate('Login');
        }
    }


    getData = async () => {
        const id = await AsyncStorage.getItem('@id');
        //const user_id = parseInt(id);
        const value = await AsyncStorage.getItem('@session_token');

        console.log(id, value);

        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + id, {
            method: 'get',
            headers: {
                ID: id,
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
            console.log(responseJson);
                this.setState({
                    isLoading: false,
                    listData: responseJson,
                });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render(){

            return(
                <View style={styles.formItem}>
                <ScrollView>
                    <Text style={styles.AccTitle}>My Account</Text> 
                    {/* prints out user info */}
                    <Text style={styles.formText}>First name: {this.state.listData.first_name}</Text>
                    <Text style={styles.formText}>Surname: {this.state.listData.last_name}</Text>
                    <Text style={styles.formText}>Email: {this.state.listData.email}</Text>

                    <View style={styles.formItem}>
                        <TouchableOpacity
                        style={styles.formTouch}
                        onPress={() => this.props.navigation.navigate('EditAccount', {
                            item: this.state.listData
                        })}
                        >
                            <Text style={styles.formTouchText}>Update account</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formItem}>
                        <Text style={styles.AccTitle}>My favourite reviews</Text>
                        <FlatList 
                        data={this.state.listData.favourite_locations}
                        renderItem={({item}) => (
                            <View style={styles.favContainer}>
                                <Text>{item.location_name}</Text>
                                <Text>{item.location_town}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => item.location_id.toString()}
                        />
                    </View>

                    

                </ScrollView>
               </View>
            );
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
    inputText: { 
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
    },
    row: {
    flex:1,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row'
    },
    favContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        padding: 8
    }
});

export default Account;
