import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, AsyncStorage, DeviceEventEmitter } from 'react-native';
import {StackNavigator} from 'react-navigation';
import * as Keychain from 'react-native-keychain';

import * as Settings from './Settings.js' //Include on every page
import Nav from './Nav'
var styles = require('./Styles.js');


export class CreateOrganizationScreen extends React.Component {
    static navigationOptions = {
        title: 'Create an Organization',
    };
    render() {
        return (
            <View>
                <CreateOrganizationBox navigation={this.props.navigation}/>
            </View>
        );
    }
}

class CreateOrganizationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name : '',
            description : '',
            owner : '',
            userId: '',
            generalErr:'',
            usernameErr: '',
            emailErr: '',
            passwordErr: ''};
    }

    createOrganization(event) {
        let name = this.state.name;
        let description = this.state.description;
        var that = this;
        return(fetch( Settings.HOME_URL + '/organization/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                organization:{
                    name: name,
                    description: description,
                }
            })
        })
            .then((response) => {
                if (!response.ok) {
                    response.json().then(function(data){
                        //Error has occured (lord forgive me for the sloppiness)

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
                        that.props.navigation.navigate()

                    });
                }
            }))

        /*.catch((error) => {
            console.error("error caught: " + error);
        });*/
    }


    render() {
        return (
            <View style={styles.bodyView}>
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

            </View>
        )
    }


}