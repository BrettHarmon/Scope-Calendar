import React from 'react';
import {TouchableOpacity, StyleSheet, ScrollView, Text, View, TextInput, Button, AsyncStorage, DeviceEventEmitter } from 'react-native';
import DatePicker from 'react-native-datepicker';
import {StackNavigator} from 'react-navigation';
import * as Keychain from 'react-native-keychain';

import * as Settings from './Settings.js' //Include on every page
var styles = require('./Styles.js');


export class CreateEventScreen extends React.Component {
    static navigationOptions = {
        title: 'Find Organizations',
    };
    render() {
        const { params } = this.props.navigation.state;
        console.log("hey" + params);
        const OrganizationId = params ? params.Id : null;
        console.log("organizationId = " + OrganizationId);
        return (
            <View style={styles.container}>
                <CreateEventBox organizationId={OrganizationId} navigation={this.props.navigation}/>
            </View>
        );
    }
}

class CreateEventBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {description : '',
            name : '',
            endDate: '',
            startDate : '',};
        console.log(this.props.organizationId);
    }


    createEvent(event) {
        let name = this.state.name;
        let description = this.state.description;
        let endDate = this.state.endDate;
        let startDate = this.state.startDate;
        let organization = this.props.organizationId;
        var that = this;
        return(fetch( Settings.HOME_URL + '/organization/event/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event:{
                    name: name,
                    description: description,
                },
                startDate: startDate,
                endDate: endDate,
                organizationId: organization,

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
                        // return back to organization page
                        DeviceEventEmitter.emit('refreshOrganization');
                        that.props.navigation.pop();
                    });
                }
            }))

    }


    render() {
        return (
            <View style={styles.bodyView}>
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
                <View style= {styles.InputSpan}>
                    <Text style= {styles.TInputLabel}>Start day / Time</Text>
                    <DatePicker
                        style={{width: 200}}
                        date={this.state.startDate}
                        mode ="datetime"
                        format="YYYY-MM-DD h:mm:ss a"
                        onDateChange={(date) => {this.setState({startDate: date})}}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        placeholder="select a start date"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                        }}
                    />
                </View>
                <View style= {styles.InputSpan}>
                    <Text style= {styles.TInputLabel}>End day / Time</Text>
                    <DatePicker
                        style={{width: 200}}
                        date={this.state.endDate}
                        mode ="datetime"
                        format="YYYY-MM-DD h:mm:ss a"
                        onDateChange={(date) => {this.setState({endDate: date})}}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        placeholder="select a end date"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                        }}
                    />
                </View>

                <Button title="Create Event" onPress={this.createEvent.bind(this)} />

            </View>
        )
    }





}