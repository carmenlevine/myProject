import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, StyleSheet, ScrollView, Text, TextInput, Button, Alert, TouchableOpacity, ToastAndroid} from 'react-native';

class EditAccountPage extends Component {
    constructor(props){
        super(props);

        this.state = {
          firstName: this.props.route.params.item.first_name,
          lastName: this.props.route.params.item.last_name,
          email: this.props.route.params.item.email,
          password: '',
          confirmPass: ''
        }
    }

    updateAccount = async () => {
        const to_send = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            email: this.state.email,
            password: this.state.password
          }

          const id = await AsyncStorage.getItem('@id');
          const value = await AsyncStorage.getItem('@session_token');
          console.log(id, value, to_send);

          return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + id, {
            
              method: 'patch', 
              headers: {
                  'Content-Type': 'application/json',
                  'X-Authorization': value
              },
              body:JSON.stringify(to_send)
          })
          .then((response) => {
            if (response.status === 200){
              console.log('User account updated');
              ToastAndroid.show('User account updated', ToastAndroid.SHORT);
              this.props.navigation.navigate('Account');
            }
            else if (response.status === 401){
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
        .catch((error) => {
            console.log(error);
        })
    }

    //validation
    Emptyfields(){
      if(this.state.email==""){
        this.setState({EmptyError:"Please fill in email field"});
      } else {
        this.setState({EmptyError:""});
      }
    }

    PasswordCheck(){
      if (this.state.password == this.state.confirmPass){
        this.setState({PasswordError:""});
      } else {
        this.setState({PasswordError:"The passwords do not match"});
      }
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
            onChangeText={(firstName) => this.setState({ firstName })}
            value={this.state.firstName}
            />
          </View>

            <View style={styles.formItem}>
            <Text style={styles.formLabel}>Last name:</Text>
            <TextInput
            placeholder="Enter last name..."
            style={styles.formInput}
            onChangeText={(lastName) => this.setState({ lastName })}
            value={this.state.lastName}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Email:</Text>
            <TextInput
            placeholder="Enter email..."
            style={styles.formInput}
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Password:</Text>
            <TextInput
            placeholder="Enter password..."
            style={styles.formInput}
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Confirm Password:</Text>
            <TextInput
              placeholder="Enter password..."
              style={styles.formInput}
              secureTextEntry
              onChangeText={(confirmPass) => this.setState({ confirmPass })}
              value={this.state.confirmPass}
            />
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
            style={styles.formTouch}
            onPress={() => this.updateAccount()}
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
