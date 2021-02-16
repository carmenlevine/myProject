import React, { Component } from 'react';
import {View, Text, TouchableOpacity, ToastAndroid, StyleSheet} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginPage extends Component {
 
    constructor(props){
        super(props);

        this.state = {
            email: "", 
            password: ""
        }
    }
    
    login = async () => {


        return fetch("http://10.0.2.2:3333/api/1.0.0/user/login",{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
               return response.json() 
            }else if(response.status === 400) {
                throw 'Invalid email or password';
            }else {
                throw 'Something went wrong';
            }
        })
        .then(async (reponseJson) => {
            console.log(reponseJson);
             await AsyncStorage.setItem('@session_token', reponseJson.token);
             this.props.navigation.navigate("HomeScreen");
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(JSON.stringify(error).ToastAndroid.SHORT);
        })
        
    }

    //validation
    Emptyfields(){
        if(this.state.password=="" || this.state.email=="")
        {
          this.setState({EmptyError:"Please fill in all fields"})
        } else {
          this.setState({EmptyError:""})
        }
      }

    render (){
        return(
            <View>
            <ScrollView>
            <Text style={styles.formItem}>Log in</Text>
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
                style={styles.formTouch}
                onPress={() => this.login()}
            >
                <Text style={styles.formTouchText}>Log in</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formItem}>
            <TouchableOpacity
                style={styles.formTouch}
                onPress={() => this.props.navigation.navigate("CreateAccount")}
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


export default LoginPage
