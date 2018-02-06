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
                      email : ''};
    }

    createAccount(event) {
        var username = this.state.username;
        var password = this.state.password;
        console.log(username);
        console.log(password);
    }

    render() {
        return (
            <View>
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
