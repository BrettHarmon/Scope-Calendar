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
            id: this.props.EventId || 0,
            description : this.props.description || '',
            name :  this.props.name || '', //this shouldn't be blank
            endDate:  this.props.endDate || 1, //Dates will be held as millisecond ticks (and then parsed into js dates)
            startDate :  this.props.startDate || 1,
            visible: this.props.seen || false,
            errors: [],
        };
    }

    DeleteEvent(){
        return(fetch( Settings.HOME_URL + '/organization/event/delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: this.state.id
                })
            }).then(() => {this.setState({visible: false})})
        );
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
                        that.setState({errors: data})

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
      return(

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.visible}
          onRequestClose={() => this.setState({visible: false})}  >

            <View style={{flex: 1, marginTop: 22}}>
                <View>
                    {this.state.errors.map((err) => <Text style={styles.hiddenError} key= {Math.random()}>{err}</Text>)}
                </View>
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
                <View style={[styles.FlexBoxContainerEvenRowSpacing, {paddingBottom: 15}]}>
                    <View style= {styles.InputSpan}>
                        <Text style= {styles.TInputLabel}>Start day / Time</Text>
                        <DatePicker
                            style={{width: 210}}
                            date={new Date(this.state.startDate)}
                            mode ="datetime"
                            format="MMMM DD YYYY h:mm a"
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
                            style={{width: 210}}
                            date={new Date(this.state.endDate)}
                            mode ="datetime"
                            format="MMMM DD YYYY h:mm a"
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
                </View>
                <Button title="Update Event"  color={'#6b52ae'}  onPress={this.ChangeEvent.bind(this)} />
                <View style={styles.hr}/>
                <Button title="Delete Event"  color={'#6b52ae'}  onPress={this.DeleteEvent.bind(this)} />
                <View style={styles.hr}/>
                <Button title="Cancel"  color={'#6b52ae'} onPress={() => this.setState({visible: false})}  />
          </View>
        </Modal>

      )

      /*  return (

        )*/
    }





}
