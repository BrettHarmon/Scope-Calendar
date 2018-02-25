import React from 'react';
import {StyleSheet, Dimensions,    TouchableOpacity, Button, Text, View, Alert, AsyncStorage} from 'react-native';
import Iconz from 'react-native-vector-icons/Ionicons';  //https://ionicframework.com/docs/ionicons/
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

import * as Settings from './Settings.js' //Include on every page
var styles = require('./Styles.js');    

export class OrganizationProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const {state} = navigation;
        let defaultTitle = 'Organization Profile'
        return {
            title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? defaultTitle: navigation.state.params.title,
        };
      };

    constructor(props){
        super(props);
        console.log(this.props.Id, this.props.OrganizationId)
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <OrganizationProfile Id={this.props.OrganizationId} navigation={this.props.navigation} />
            </View>
        );
    }
}

//Very important to pass organization ID to this
class OrganizationProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ready: false,
            name : '',
            subscribed: null,
            description : '',
            upcomingEvents: {},
            items: {}
        };
    }

    componentWillMount(){
        this.getOrganization(this.props.Id)
        .then((org) => {
            if (!!org){ //org object exists (not undefined/null/empty string)
                this.props.navigation.setParams({ title: org.name });
                console.log('Organization object:: ',org)
                this.setState({
                    name: org.name,
                    subscribed: org.isSubbed,
                    description: org.description,
                    ready: true,
                    upcomingEvents:{}
                });
            }else{
                this.setState({ ready: true });
            }
        })
    }
    
    getOrganization(id){
        return fetch( Settings.HOME_URL + '/organization/info', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: id
            })
        })
        .then((response) => {
            console.log(id, response)
            if(!response.ok){
                return null;
            }
            return response.json().then(function (json) {
                let result = {};
                result.name = json.name;
                result.description = json.description;
                result.isSubbed = isSubscribed;
                //TODO: set upcoming events
                /*
                {
                  day: 1,     // day of month (1-31)
                  month: 1,   // month of year (1-12)
                  year: 2017, // year
                  timestamp,   // UTC timestamp representing 00:00 AM of this date
                  dateString: '2016-05-13' // date formatted as 'YYYY-MM-DD' string
                }
                */
               return result;
            })
        })
        .catch(console.log("error loading organization details")); //TODO: Handle this in UI
    }


    SubscribeButton(){
        if(this.state.subscribed){
            //Display a subscribed button
            return(
                <TouchableOpacity style={{backgroundColor: "#6b52ae", alignItems: 'center',}} onPress={this._onPressButton}>
                  <Text>Subscribed</Text>
                  <Iconz name="md-checkmark" color ="#fff" /*size={28}*//>
                </TouchableOpacity>
            );
        }else{
            return(
                <TouchableOpacity style={{backgroundColor: "#6b52ae", alignItems: 'center',}} onPress={this._onPressButton}>
                  <Text>Subscribe</Text>
                </TouchableOpacity>
            );
        }
    }

    render() {
        if(!this.state.ready){
            return null;
        }
        var today = new Date();
        var oneWeek = new Date(today);
        oneWeek.setDate(today.getDate() + 7);
        var wide = Dimensions.get('window').width;

        return (
            <View style={styles.bodyView}>
                {this.SubscribeButton()}
                <View>
                    <Text> Upcoming Events </Text>
                </View>

                <Agenda
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    selected={'2017-05-16'}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    // markingType={'period'}
                    style= {{width: wide}}
                    // markedDates={{
                    //    '2017-05-08': {textColor: '#666'},
                    //    '2017-05-09': {textColor: '#666'},
                    //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
                    //    '2017-05-21': {startingDay: true, color: 'blue'},
                    //    '2017-05-22': {endingDay: true, color: 'gray'},
                    //    '2017-05-24': {startingDay: true, color: 'gray'},
                    //    '2017-05-25': {color: 'gray'},
                    //    '2017-05-26': {endingDay: true, color: 'gray'}}}
                    // monthFormat={'yyyy'}
                    // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
                    //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
                />
            </View>
        );
    }
    loadItems(day) {
        console.log('loaded event items for day',day);
        setTimeout(() => {
          for (let i = -15; i < 85; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = this.timeToString(time);
            if (!this.state.items[strTime]) {
              this.state.items[strTime] = [];
              const numItems = Math.floor(Math.random() * 5);
              for (let j = 0; j < numItems; j++) {
                this.state.items[strTime].push({
                  name: 'Item for ' + strTime,
                  height: Math.max(50, Math.floor(Math.random() * 150))
                });
              }
            }
          }
          //console.log(this.state.items);
          const newItems = {};
          Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
          this.setState({
            items: newItems
          });
        }, 1000);
        // console.log(`Load Items for ${day.year}-${day.month}`);
    }

    renderItem(item) {
        return (
            <View style={[styles.agnedaItem, {height: item.height}]}><Text>{item.name}</Text></View>
        );
    }

    renderEmptyDate() {
    return (
        <View style={styles.agendaEmptyDate}><Text>Nothing planned today.</Text></View>
    );
    }

    rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
    }

    timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
    }
}

