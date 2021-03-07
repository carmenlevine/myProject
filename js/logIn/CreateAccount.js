import React, { Component } from 'react';
import {View, StyleSheet, ToastAndroid, Text, TouchableOpacity} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';

//This page allows the user to create an account on the server by inputting their details and be navigated to the log in screen in order to
//log in to the app for use.

class CreateAccountPage extends Component{
  constructor(props){
    super(props);

    this.state = {
      //the values that the user inputs will be stored in these values, so they can be used and passed to other pages and functions
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPass: ''
  }
}

signUp = () => {
//this function uses a post request to send all the inputted values to the server, so that an account can be created on the server
    const to_send = {
      //assigns the inputted values to the values that the server recognises
      first_name:this.state.firstName,
      last_name:this.state.lastName,
      email:this.state.email,
      password:this.state.password
    }
    
    return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(to_send) //send the values to the server in the body of the request
    })
    .then((response) => {
      if(response.status === 201){
        return response.json();
      }else if(response.status === 400){
        throw 'Failed validation';
      }else {
        throw 'Something went wrong';
      }
    })
      .then((responseJson) => {
        //prints user id to the console and navigates to the log in screen so user can log into the system
        console.log("User created with ID: ", responseJson); 
        ToastAndroid.show("Account created", ToastAndroid.SHORT);
        this.props.navigation.navigate("Login");
      })
      .catch((error) => {
        console.log((error));
        ToastAndroid.show(JSON.stringify(error), ToastAndroid.SHORT);
      })
    }

    //validation to ensure the email field is left not empty
    Emptyfields(){
      if(this.state.email=="")
      {
        this.setState({EmptyError:"Please fill in email field"});
      } else {
        this.setState({EmptyError:""});
      }
    }

    //validation to ensure the password and confirm passwords are identical
    PasswordCheck(){
      if(this.state.password == this.state.confirmPass){
        this.setState({PasswordError:""});
      } else {
        this.setState({PasswordError:"The passwords do not match"});
      }
    }

  render(){

    const navigation = this.props.navigation;
  
    return(
      <View>
        <ScrollView>
          <Text style={styles.title}>Create an account</Text>
          {/* when the user inputs text into the following fields, it will be assigned to the value of that field to create an account with*/}
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
            //button that when pressed calls the sign up function so an account is created and the user is navigated to the log in screen
            style={styles.formTouch}
            onPress={() => this.signUp()}
            >
              <Text style={styles.formTouchText}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
            //button so it is possible to go back to the login screen without creating a new account
            style={styles.formTouch}
            onPress={()=>this.props.navigation.navigate("Login")}
            >
              <Text style={styles.formTouchText}>Already have an account?</Text>
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
  
});


export default CreateAccountPage
