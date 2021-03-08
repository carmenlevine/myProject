import React, { Component } from 'react';
import {View, Text, TouchableOpacity, ToastAndroid, StyleSheet} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

//This page forms the log in page where the user can input their account detais and log into the application by creating a session token
//This page is the one that is presented when the application is started.

class LoginPage extends Component {
 
    constructor(props){
        super(props);

        this.state = {
          //variables where the values that the user inputs will be assigned to
            email: "", 
            password: ""
        }
    }

    login = async () => {
      //this function uses a post request to send the inputted details from the user to the server in order to log into the application
      const to_send = {
        //assigns the inputted values to the values that the server recognises
        "first_name":this.state.firstName,
        "last_name":this.state.lastName,
        "email":this.state.email,
        "password":this.state.password
      }

        return fetch("http://10.0.2.2:3333/api/1.0.0/user/login",{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(to_send), //sends the user inputted values to the server in the body of the request
        })
        .then((response) => {
            if(response.status === 200){
               return response.json();
            }else if(response.status === 400) {
                throw 'Invalid email or password';
            }else {
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
          //assign the session token and id of the user using async storage so these can be used to carry out other functions throughout the app
          //and confirm that the user is logged in. Navigate to the home page, which includes the draw nav.
            console.log(responseJson);
             await AsyncStorage.setItem('@session_token', responseJson.token);
             await AsyncStorage.setItem('@id', responseJson.id.toString());
             this.props.navigation.navigate("Home");
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(JSON.stringify(error).ToastAndroid.SHORT);
        })
        
    }

    //validation to ensure that both the fields are filled in
    Emptyfields(){
        if(this.state.password=="" || this.state.email=="")
        {
          this.setState({EmptyError:"Please fill in all fields"})
        } else {
          this.setState({EmptyError:""})
        }
      }

    render (){
      const navigation = this.props.navigation;

        return(
            <View>
            <ScrollView>
            <Text style={styles.title}>Log in</Text>
            {/* when the user inputs their details, it assigns them to the values already initiated*/}
            <View style={styles.formItem}>
            <TextInput
            placeholder= "Enter your email..."
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            style={styles.formInput}
            />
            </View>

            <View style={styles.formItem}>
            <TextInput
                placeholder="Enter your password..."
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                secureTextEntry
                style={styles.formInput}
            />
            </View>

            <View style={styles.formItem}>
            <TouchableOpacity
            //Button calls the log in function when pressed and logs into navigate towards the homepage
                style={styles.formTouch}
                onPress={() => this.login()}
            >
                <Text style={styles.formTouchText}>Log in</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formItem}>
              <TouchableOpacity
              //button that navigates to the create an account page so a new user can create an account if they dont already have one.
              style={styles.formTouch}
              onPress={() => this.props.navigation.navigate('CreateAccount')}
              >
                <Text style={styles.formTouchText}>Create an account</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
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
      padding:20
    },
    formLabel: {
      fontSize:15,
      color:'steelblue'
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
    }
  })


export default LoginPage;
