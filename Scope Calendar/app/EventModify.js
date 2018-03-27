import React from 'react';
import {TextInput, StyleSheet, Text, View, TouchableHighlight,
   Modal, Animated, Button} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {StackNavigator} from 'react-navigation';
import * as Keychain from 'react-native-keychain';

var utility = require('./fnUtils.js');
import * as Settings from './Settings.js' //Include on every page
var styles = require('./Styles.js');


export class EventModifyBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //id: params.EventId || 0,
            description : this.props.description || '',
          //  name : params.name || '', //this shouldn't be blank
          //  endDate: params.endDate || 0, //Dates will be held as ticks (milliSec)
          //  startDate : params.startDate || 0,
            visible: this.props.seen || false,
        };
    }

    componentWillMount(){
        // Populate update box
        // TODO:
    }

    PopulateEventEditor(eventId){
            //TODO:
    }

    ChangeEvent(event) {
        let name = this.state.name;
        let description = this.state.description;
        let endDate = this.state.endDate;
        let startDate = this.state.startDate;
        let evtId = this.state.id;
        var that = this;
        return(fetch( Settings.HOME_URL + '/organization/event/modify', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event:{
                    name: name,
                    description: description,
                    startDate: startDate,
                    endDate: endDate,
                    eventId: evtId,
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
                        // return back to organization page
                        DeviceEventEmitter.emit('refreshOrganization');
                        that.props.navigation.pop();
                    });
                }
            }))

    }


    render() {
      console.log('EventBox Modal rendered. Visable?', this.state.visible);
      return(

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.visible}
          onRequestClose={() => this.setState({visible: false})}  >
          <View style={{flex: 1, marginTop: 22}}>
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
                        format="MMMM DD YYYY h:mm:ss a"
                        onDateChange={(date) => {this.setState({startDate: new Date(date).getTime()})}}
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
                        format="MMMM DD YYYY h:mm:ss a"
                        onDateChange={(date) => {this.setState({endDate: new Date(date).getTime()})}}
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

                <Button title="Update Event" onPress={this.ChangeEvent.bind(this)} />
                <Button title="Cancel" onPress={() => this.setState({visible: false})}  />
          </View>
        </Modal>

      )

      /*  return (

        )*/
    }





}
