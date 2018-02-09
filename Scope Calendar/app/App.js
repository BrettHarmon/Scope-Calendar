import * as Setting from './Settings.js' //Include on every page
import Nav from './Nav'

import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View>
        <Text>Welcome to Scope Calendar</Text>
        <Text>Changes you make will automatically reload.</Text>
        <LoginBox></LoginBox>
      </View>
    );
  }
}

class LoginBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username : '',
                      password : '',
                      email : '',
                      userId: ''};
    }

    createAccount(event) {
        let username = this.state.username;
        let password = this.state.password;
        let email = this.state.email;
        console.log(username);
        console.log(password);

        return (fetch( Setting.HOME_URL + '/signup', {

            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
            })
            .catch((error) => {
                console.error(error);
            }))
        /*return fetch('http://10.128.65.175:8080/test')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    userId: responseJson.userId,
                }, function() {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });*/

    }

    render() {
        return (
            <View>
                <Nav type="login" onPress = {() => this.props.navigator.replace({id:'home'})} />
                <TextInput

                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                />
                <TextInput

                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                />
                <TextInput

                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                />
                <Button title="Create Account" onPress={this.createAccount.bind(this)}>

                </Button>


            </View>
        )
    }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
