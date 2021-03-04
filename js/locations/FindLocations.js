import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Flatlist, StyleSheet, Searchbar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FindLocation extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            listData: [],
            location_id: '',
            query: '',
            overallRating: null,
            priceRating: null,
            qualityRating: null,
            clenlinessRating: null,
            search:''
        }
    }
        componentDidMount(){
            this.unsubscribe = this.props.navigation.addListener('focus', () => {
                this.checkLoggedIn();
            });
            this.searchData();
        }
    
        componentWillUnmount(){
            this.unsubscribe();
        }
    
        checkLoggedIn = async () => {
            const value = await AsyncStorage.getItem('@session_token');
            if(value === null){
                this.props.navigation.navigate('Login');
            }
        }

        searchData = async () => {
            // const { location_id } = this.props.route.params;
            let value = await AsyncStorage.getItem('@session_token');
            return fetch("http://10.0.2.2:3333/api/1.0.0/find?", {
                method: 'get',
                headers: {
                    'X-Authorization': value
                },
            })
            .then((response) => {
                if (response.status === 200){
                    return response.json();
                } else if (response.status === 401){
                    ToastAndroid.show('You are not logged in', ToastAndroid.SHORT);
                    this.props.navigation.navigate('Login');
                } else {
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    isLoading: false,
                    listData: responseJson
                })
            })
            .catch((error) => {
                console.log(error);
            });
        }

        render(){
            const navigation = this.props.navigation;

            if (this.state.isLoading){
                return(
                    <View style={styles.container}>
                        <Text style={styles.title}>Loading locations...</Text>
                    </View>
                )
            } else{
                return(
                    <View>
                        <Searchbar
                        placeholder='Search locations...'
                        onChangeText={(query) => this.setState({query})}
                        value={this.state.query}
                        />

                        <TouchableOpacity
                        onPress={() => this.searchData()}
                        >Search</TouchableOpacity>

                        <Flatlist 
                        data={this.state.listData}
                        renderItem={({item}) => (
                            <TouchableOpacity 
                            style={styles.LocContainer}
                            onPress={() => navigation.navigate('AddReview', {
                                location_id: item.location_id,
                            })}
                            >
                                <Text style={styles.locationDetails}>
                                    {item.location_name}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item,index) => item.location_id.toString()}
                        />
                    </View>
                )
            }
        }
    
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center'
    },
    title: {
        padding:5,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    locationDetails: {
        fontSize: 12,
        justifyContent: 'center'
    }
});

export default FindLocation;
