import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, DeviceEventEmitter } from 'react-native';
import {StackNavigator} from 'react-navigation';
import * as Keychain from 'react-native-keychain';

var utility = require('./fnUtils.js');
import * as Settings from './Settings.js' //Include on every page
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
            error: '',
            fake: true,};
    }

    login(event) {
        var identity = this.state.identity;
        var password = this.state.password;
        var that = this;

        var details = {
            'identity': identity,
            'password': password
        };

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        return (
            fetch( Settings.HOME_URL + '/signin', {

                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                },
                body: formBody
            })
            .then((response) => {
                if(response.ok) {

                    return fetch( Settings.HOME_URL + '/LoginAuth', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            "Content-type": "application/x-www-form-urlencoded",
                        },
                    })
                        .then((response) => {
                            return response.json().then(function (json) {
                                let username = json.username;
                                if(username == 'anonymousUser'){ //ran in debug with all authentication allowed
                                    return null;
                                }
                                //Cookie to perserve authenticted user
                                let user = {
                                    //id: json.userId,
                                    username: json.username,
                                };
                                DeviceEventEmitter.emit('refreshHome',  json.username);
                                that.props.navigation.popToTop(); //go back to start
                            })
                        }).catch((error) => {
                            console.log('Error with userInfoFetch');
                        });

                }
                else{
                    that.setState({error: "Could not find hello with that username/email and password."});
                    response.json().then(function (json) {
                        console.log(json + "heyyyyeeeee");
                    });
                    if (response === null) {
                        console.log("response is null");
                    }
                }
            })

            .catch((err) => {
                console.log(err + 'rerererere');
                that.setState({error: err.message});
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
                        autoCorrect = {false}
                        autoCapitalize = {'none'}
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
                <Button title="Log in" onPress={this.login.bind(this)} color = {"#6b52ae"}/>



            </View>
        )
    }


}
