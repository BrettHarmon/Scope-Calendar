
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, AsyncStorage, DeviceEventEmitter } from 'react-native';
import {StackNavigator} from 'react-navigation';

import * as Settings from './Settings.js' //Include on every page
import Nav from './Nav'
var styles = require('./Styles.js');



export class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Log in',
    };
  render() {
    return (
        <View>
            <SignUp navigation={this.props.navigation}/>
        </View>
    );
  }
}

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username : '',
                      password : '',
                  };
    }
    loginFetch(event){
        let username1 = 'brett';
        let password1 = 'asdfasdf';
        obj = {
            username: username1,
            password: password1
        };
            let ret = [];
            for (let d in obj)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(obj[d]));
        let r = ret.join('&');
        //let query = urllib.urlencode(obj);
        console.log(r);
        return(fetch( Settings.HOME_URL + '/login', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                   username: username1,
                   password: password1,
                })
        }).then(response => {
            console.log(response);
        }));


    }
    render(){
        return(
            <View>
                <Button title="Log In" onPress={this.loginFetch.bind(this)} />
            </View>
        )
    }
}
