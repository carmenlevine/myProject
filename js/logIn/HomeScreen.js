import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//This page forms the home page that is seen once the user logs into the application.
//It is also used for the app to navigate back to after performing some of the functions.

class HomeScreen extends Component{
  constructor(props){
    super(props);
  }

  //Ensures that the user has logged in. If there is no session token, it will navigate the user back to the log in screen
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
    //Prints a simple welcome message

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
