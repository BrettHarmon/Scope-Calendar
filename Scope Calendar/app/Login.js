import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import {StackNavigator} from 'react-navigation';

import * as Settings from './Settings.js' //Include on every page
import Nav from './Nav'
var styles = require('./Styles.js');


export class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Login',
    };
    render() {
        return (
            <View>
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
            email : '',
            username : '',
            error: ''};
    }

    login(event) {
        var email = this.state.email;
        var password = this.state.password;
        var that = this;

        const querystring = require('querystring');
        console.log(querystring.stringify({email: 'testerrrr', password: 'password',}));

        return (fetch( 'http://10.0.0.182:8080/signin', {

            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
            },
            body: querystring.stringify({
                email: email,
                password: password,
            })
        }))
            .then(function(response) {
                response.json().then(function (json) {
                    console.log(JSON.stringify(json));
                    console.log(that.state.password);
                    that.setState(function(previousState) {
                        return {username : json.username}
                    });
                    that.props.navigation.navigate('Created', {username: that.state.username})

                })

            })
            .catch((error) => {
                console.error(error);
            })
    }


    render() {
        return (
            <View style={styles.bodyView}>
                <Text style={{color: "#d10000", textAlign: 'center'}}>{this.state.generalErr}</Text>
                <View style= {styles.InputSpan}>
                    <Text style= {styles.TInputLabel}>Username or Email</Text>
                    <TextInput
                        style = {styles.TInput}
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
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