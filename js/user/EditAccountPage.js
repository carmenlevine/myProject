import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {View, StyleSheet, ScrollView, Text, TextInput, Button, Alert, TouchableOpacity, ToastAndroid} from 'react-native';

class EditAccountPage extends Component {
    constructor(props){
        super(props);

        this.state = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPass: ''
        }
    }

    updateAccount = async () => {
        let to_send = {
            "first_name":this.state.firstName,
            "last_name":this.state.lastName,
            "email":this.state.email,
            "password":this.state.password
          }

          const id = await AsyncStorage.getItem('@user_id');
          const userId = JSON.parse(id);
          const value = await AsyncStorage.getItem('@session_token');
          console.log(user_id, value);

          return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + userId, {
              method: 'patch',
              headers: {
                  'Content-Type': 'application/json',
                  'X-Authorization': value
              },
              body:JSON.stringify(to_send)
          })
          .then((response) => {
            if(response.status === 200){
               ToastAndroid.show('Details updated successfully', ToastAndroid.SHORT);
            }else {
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            console.log('User account updated');
            this.props.navigation.navigate('Home');
        })
        .catch((error) => {
            console.log(error);
        })
    }

    updateTO (){
        this.updateAccount();
        this.props.navigation.navigate('HomeScreen');
    }

    render(){
        const navigation = this.props.navigation;

        return(
          <View style={styles.container}>
            <ScrollView>
            <Text style={styles.title}>Update account</Text>

            <View style ={styles.formItem}>
            <Text style={styles.formLabel}>First Name:</Text>
            <TextInput
            placeholder="Enter first name..."
            style={styles.formInput}
            onChangeText={(firstName) => this.setState({firstName})}
            value={this.state.firstName}
            />
          </View>

            <View style={styles.formItem}>
            <Text style={styles.formLabel}>Last name:</Text>
            <TextInput
            placeholder="Enter last name..."
            style={styles.formInput}
            onChangeText={(lastName) => this.setState({lastName})}
            value={this.state.lastName}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Email:</Text>
            <TextInput
            placeholder="Enter email..."
            style={styles.formInput}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Password:</Text>
            <TextInput
            placeholder="Enter password..."
            style={styles.formInput}
            secureTextEntry
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Confirm Password:</Text>
            <TextInput
              placeholder="Enter password..."
              style={styles.formInput}
              secureTextEntry
              onChangeText={(confirmPass) => this.setState({confirmPass})}
              value={this.state.confirmPass}
            />
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
            style={styles.formTouch}
            onPress={() => this.updateTO()}
            >
              <Text style={styles.formTouchText}>Update</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
            style={styles.formCancelTouch}
            onPress={() => this.props.navigation.navigate("Account")}
            >
              <Text style={styles.formCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
            </ScrollView>
            </View>
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
      justifyContent: 'center'
  },
  title: {
      paddingVertical: 10,
      textAlign: 'center',
      fontSize: 28,
      fontWeight: 'bold'
  }
  })

export default EditAccountPage;
