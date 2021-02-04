import React, { Component } from 'react';
import {View, StyleSheet, ToastAndroid, Text, TouchableOpacity} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';

class CreateAccount extends Component{
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

signUp = () => {
  //validation needed here
    return fetch("http://10.0.2.2.3333/api/1.0.0/user", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
      if(response.status == 201){
        return response.json()
      }else if(response.status === 400){
        throw 'Failed validation';
      }else {
        throw 'Something went wrong';
      }})
      .then((responseJson) => {
        console.log("User created with ID: ", responseJson);
        ToastAndroid.show("Account created", ToastAndroid.SHORT);
        this.props.navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      })
    }

  render(){

    const navigation = this.props.navigation;
  
    return(
      <View>
        <ScrollView>
          <Text style={styles.title}>Create an account</Text>

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
              placeholder="enter password..."
              style={styles.formInput}
              secureTextEntry
              onChangeText={(confirmPass) => this.setState({confirmPass})}
              value={this.state.confirmPass}
            />
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
            style={styles.formTouch}
            onPress={() => this.signUp()}
            >
              <Text style={styles.formTouchText}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
            style={styles.formTouch}
            onPress={()=>this.props.navigation.navigate('HomeScreen')}
            >
              <Text style={styles.formTouchText}>Log In</Text>
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


export default CreateAccount