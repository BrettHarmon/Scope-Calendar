import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, AsyncStorage, DeviceEventEmitter } from 'react-native';
import {StackNavigator} from 'react-navigation';
import * as Keychain from 'react-native-keychain';

import * as Settings from './Settings.js' //Include on every page
var styles = require('./Styles.js');


export class CreateOrganizationScreen extends React.Component {
    static navigationOptions = {
        title: 'Create an Organization',
    };
    render() {
        return (
            <View style={styles.container}>
                <CreateOrganizationBox navigation={this.props.navigation}/>
            </View>
        );
    }
}

class CreateOrganizationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            description : '',
            owner : '',
            generalErr:'',};
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

                        // for now just going back to homepage. checked to see if it worked on backend
                        //that.props.navigation.navigate('OrganizationProfile', {organization: json.organization.organizationId, nagivation: that.props.navigation});
                        that.props.navigation.popToTop();
                        that.props.navigation.navigate('TestOrganizationProfile', {
                            OrganizationId: json.organizationId
                        });
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
                    <Text style= {styles.TInputLabel}>Name</Text>
                    <TextInput
                        style = {styles.TInput}
                        onChangeText={(name) => this.setState({name})}
                        value={this.state.name}
                    />
                </View>

                <View style= {styles.InputSpan}>
                    <Text style= {styles.TInputLabel}>Description</Text>
                    <TextInput
                        style = {styles.TInput}
                        onChangeText={(description) => this.setState({description})}
                        value={this.state.description}
                    />
                </View>

                <Button title="Create Organization" onPress={this.createOrganization.bind(this)} />

            </View>
        )
    }


}