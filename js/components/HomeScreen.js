import React, { Component } from 'react';
import {View, StyleSheet, ToastAndroid, ScrollView, Text, TextInput, Button, Alert, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

class HomeScreen extends Component{


  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: []
    }
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus',() => {
      this.checkLoggedIn();
    });

    this.getData();
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/find", {
      'headers': {
        'X-Authorization': value
      }
    })
        .then((response) => {
            if(response.status === 200){
               return response.json() 
            }else if(response.status === 401) {
              ToastAndroid.show("Youre not logged in", ToastAndroid.SHORT);
              this.props.navigation.navigate("Login");
            }else {
                throw 'Something went wrong';
            }
        })
        .then((reponseJson) => {
            this.setState({
              isLoading: false,
              listData: reponseJson
            })
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(JSON.stringify(error).ToastAndroid.SHORT);
        })
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null){
      this.props.navigation.navigate("Login");
    }
  };


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
    } else {
      return(
        <View style={styles.container}>
          <Text style={styles.title}>Coffee shops near you</Text>
          <FlatList
            data={this.state.listData}
            style={styles.formItem}
            renderItem={({item}) => (
            <View style={styles.row}>
            <Text>{item.location_name}</Text>
            </View>
            )}
            keyExtractor={(item,index) => item.location_id.toString()}
          />
        </View>
      );
    }

  }
}

const styles = StyleSheet.create({
  title: {
    color:'steelblue',
    backgroundColor:'lightblue',
    padding:10,
    textAlign: 'center',
    fontSize:25
  },
  formItem: {
    padding:20,
    backgroundColor: 'lightblue',
    color: 'darkblue',
  },
  container: {

  },
  row: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: "row"
  }
})

export default HomeScreen
