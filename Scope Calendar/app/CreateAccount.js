
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, DeviceEventEmitter } from 'react-native';
import {StackNavigator} from 'react-navigation';
import * as Keychain from 'react-native-keychain';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import * as Settings from './Settings.js' //Include on every page
var styles = require('./Styles.js');


export class CreateAccountScreen extends React.Component {
    static navigationOptions = {
        title: 'Create an Account',
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
        this.state = {username : '',
                      password : '',
                      password2: '',
                      email : '',
                      userId: '',
                      generalErr:'',
                      usernameErr: '',
                      emailErr: '',
                      passwordErr: ''};
    }

    createAccount(event) {
        //Reset error messages
        this.setState({generalErr:'', usernameErr:'', emailErr: '', passwordErr: ''});
        let username = this.state.username;
        let password = this.state.password;
        let password2 = this.state.password2;
        let email = this.state.email;

        var that = this;
        return(fetch( Settings.HOME_URL + '/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user:{
                    username: username,
                    password: password,
                    email: email
                },
                password2: password2
            })
        })
        .then((response) => {
            if (!response.ok) {
                response.json().then(function(data){
                    //Error has occured (lord forgive me for the sloppiness)
                    if(!!data.generalError){
                        that.setState({generalErr: data.generalError});
                    }if(!!data.usernameError){
                        that.setState({usernameErr: data.usernameError});
                    }if(!!data.emailError){
                        that.setState({emailErr: data.emailError});
                    }if(!!data.passwordError){
                        that.setState({passwordErr: data.passwordError});
                    }
                });
            }
            else{
                response.json().then(function (json) {

                    //Cookie to perserve authenticted user
                    /*let user = {
                            id: json.userId,
                            username: json.username,
                            ROLE_LIST: json.role
                    };

                    AsyncStorage.setItem('UserInfo', JSON.stringify(user));
*/
                    //Keychain.setGenericPassword(json.username, "password");
                    DeviceEventEmitter.emit('refreshHome',  json.username, json.userId);
                    that.props.navigation.popToTop(); //go back to start

                });
            }
        }))

            /*.catch((error) => {
                console.error("error caught: " + error);
            });*/
    }


    render() {
        return (
            <ScrollView style={styles.bodyView} >
                <Text style={{color: "#d10000", textAlign: 'center'}}>{this.state.generalErr}</Text>

                <View style= {styles.InputSpan}>
                    <Text style= {styles.TInputLabel}>Username</Text>
                    <TextInput
                        style = {styles.TInput}
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username}
                    />
                <Text style={styles.hiddenError}>{this.state.usernameErr}</Text>
                </View>

                <View style= {styles.InputSpan}>
                    <Text style= {styles.TInputLabel}>Email</Text>
                    <TextInput
                        style = {styles.TInput}
                        onChangeText={(email) => this.setState({email})}
                        keyboardType = {"email-address"}
                        value={this.state.email}
                    />
                <Text style={styles.hiddenError}>{this.state.emailErr}</Text>
                </View>

                <View style= {styles.InputSpan}>
                    <Text style= {styles.TInputLabel}>Password</Text>
                    <TextInput
                        style = {styles.TInput}
                        secureTextEntry= {true}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                    />
                    <Text style={styles.hiddenError}>{this.state.passwordErr}</Text>
                </View>

                <View style= {styles.InputSpan}>
                    <Text style= {styles.TInputLabel}>Confirm password</Text>
                    <TextInput
                        style = {styles.TInput}
                        secureTextEntry= {true}
                        onChangeText={(password2) => this.setState({password2})}
                        value={this.state.password2}
                    />
                </View>

                <Button title="Create Account" onPress={this.createAccount.bind(this)} />
                <KeyboardSpacer/>
            </ScrollView>
        )
    }


}
