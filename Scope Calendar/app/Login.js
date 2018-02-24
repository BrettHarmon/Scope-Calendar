import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, DeviceEventEmitter } from 'react-native';
import {StackNavigator} from 'react-navigation';
import * as Keychain from 'react-native-keychain';

import * as Settings from './Settings.js' //Include on every page
import Nav from './Nav'
var styles = require('./Styles.js');
var Storage = require('./IStorage.js');


export class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Login',
    };
    render() {
        return (
            <View style={styles.container}>
                <LoginBox navigation={this.props.navigation}/>
            </View>
        );
    }
}

class LoginBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password : '',
            identity : '',
            error: ''};
    }

    login(event) {
        var identity = this.state.identity;
        var password = this.state.password;
        var that = this;

        const querystring = require('querystring');

        return (
            fetch( Settings.HOME_URL + '/signin', {

                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                },
                body: querystring.stringify({
                    identity: identity,
                    password: password,
                })
            })
            .then((response) => {
                //console.log(response);
                if(response.ok ) {
                    response.json().then(function (json) {
                        console.log('Log in response: ', json.username);
                        //Cookie to perserve authenticted user
                        let user = {
                                //id: json.userId,
                                username: json.username,
                        };
                        //Keychain.setGenericPassword(json.username, "password");
                        //Storage.set('UserInfo', json.username); //JSON.stringify(user));
                        //AsyncStorage.setItem();
                        DeviceEventEmitter.emit('refreshHome',  json.username);
                        that.props.navigation.popToTop(); //go back to start
                    });
                }
                else{
                    that.setState({error: "Could not find account with that username/email and password."});
                }
            }) 
            
            .catch((err) => {
                that.setState({error: err});
                console.error(err);
            })
        );
    }


    render() {
        return (
            <View style={styles.bodyView}>
                <Text style={{color: "#d10000", textAlign: 'center'}}>{this.state.error}</Text>
                <View style= {styles.InputSpan}>
                    <Text style= {styles.TInputLabel}>Username or Email</Text>
                    <TextInput
                        style = {styles.TInput}
                        onChangeText={(identity) => this.setState({identity})}
                        value={this.state.identity}
                    />
                </View>

                <View style= {styles.InputSpan}>
                    <Text style= {styles.TInputLabel}>Password</Text>
                    <TextInput
                        style = {styles.TInput}
                        secureTextEntry= {true}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                    />
                </View>
                <Button title="Log in" onPress={this.login.bind(this)} />



            </View>
        )
    }


}
