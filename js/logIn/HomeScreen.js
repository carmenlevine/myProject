import React, { Component } from 'react';
import {View, StyleSheet, ToastAndroid, ScrollView, Text, TextInput, Button, Alert, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

class HomeScreen extends Component{
  constructor(props){
    super(props);
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


  render(){

    const navigation = this.props.navigation;

      return(
        <ScrollView 
        contentContainerStyle={{flex:1, justifyContent: 'center'}}
        >
          <Text style={styles.title}>Welcome back</Text>
          
        </ScrollView>
      );
    }

  }

const styles = StyleSheet.create({
  title: {
    color:'steelblue',
    backgroundColor:'lightblue',
    padding:10,
    textAlign: 'center',
    fontSize:25,
    fontWeight: 'bold'
  },
  formItem: {
    padding:20,
    backgroundColor: 'lightblue',
    color: 'darkblue',
  },
  container: {
    padding:15,
    flex:1,
    justifyContent: 'center'
  },
  row: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: "row"
  },
  Loadingtitle: {
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold'
  }
});

export default HomeScreen;
