import React, { Component } from 'react';
import {View, StyleSheet, ScrollView, Text, TextInput, Button, Alert, TouchableOpacity} from 'react-native';

class HomeScreen extends Component{
  constructor(props){
    super(props);
  

  this.state = {
    email: '',
    password: ''
  }
}

logIn = () => {
    console.log(this.state);
  }

  render(){

    const navigation = this.props.navigation;

    return(
      <View>
        <ScrollView>
          <Text style={styles.title}>Log in</Text>

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
            <Text style={styles.formLabel}>Password</Text>
            <TextInput
            placeholder="Enter password..."
            style={styles.formInput}
            secureTextEntry
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            />
          </View>


          <View style={styles.formItem}>
            <TouchableOpacity
            style={styles.formTouch}
            onPress={() => this.logIn()}
            >
              <Text style={styles.formTouchText}>Log in</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
            style={styles.formTouch}
            onPress={()=>this.props.navigation.navigate('CreateAccount')}
            >
            <Text style={styles.formTouchText}>Create Account</Text>
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

export default HomeScreen