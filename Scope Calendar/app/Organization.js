import React from 'react';
import {StyleSheet, Dimensions, ScrollView, TouchableOpacity, Button, Text, View, Alert, AsyncStorage} from 'react-native';
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
    }

    render() {
        const { params } = this.props.navigation.state;
        const OrganizationId = params ? params.OrganizationId : null;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <OrganizationProfile Id={OrganizationId} navigation={this.props.navigation} />
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
            name : 'Organization Profile',
            subscribed: null,
            subscribers: 0,
            description : '',
            upcomingEvents: {},
            selected: null,
        };
    }

    componentWillMount(){
        this.getOrganization(this.props.Id)
        .then((org) => {
            if (!!org){ //org object exists (not undefined/null/empty string)
                this.props.navigation.setParams({ title: org.name });
                this.setState({
                    name: org.name,
                    subscribed: org.isSubbed,
                    description: org.description,
                    ready: true,
                    subscribers: org.subs,
                    upcomingEvents: org.upcomingEvents,
                    selected: org.firstEvent
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
            if(!response.ok){
                return null;
            }
            return response.json().then(function (json) {
                //Load upcoming events
                var events = {};
                var today = new Date();

                for (let i = -3; i < 31; i++) {
                    let time = today.getTime() + i * 24 * 60 * 60 * 1000;
                    let strTime = Settings.timeToString(time);
                    events[strTime] = [];
                  }

                var firstDay = new Date(8640000000000000);  //Set as max possible date
                json.events.forEach((element) => {
                    //get day(as string) eg: '2018-03-15'
                    let startDateMils = element.startDate.millis;
                    let strTime = Settings.timeToString(startDateMils);
                    
                    //get earliest event (in future)
                    if(firstDay.getTime() >  startDateMils && startDateMils > today.getTime()){
                        firstDay = new Date(startDateMils);
                    }

                    //Timezone offset
                    let offset = element.timezoneOffset;

                    events[strTime].push({
                        event: element.name,
                        description: element.description,
                        start : new Date(element.startDate.millis + (offset * 3600 * 1000) ),
                        end : new Date(element.endDate.millis + (offset * 3600 * 1000)),
                    });
                });
                let result = {};
                result.name = json.name;
                result.description = json.description;
                result.isSubbed = json.isSubscribed== 'true';
                result.subs = parseInt(json.subscribers, 10);
                result.upcomingEvents = events;
                result.firstEvent = new Date(Settings.timeToString(firstDay.getTime()));
               return result;
            })
        })
        .catch((err) => {
            console.error('fetchOrganization Error caught: ',err);
        });
    }

    OrganizationSub(){
        var that = this;
        fetch( Settings.HOME_URL + '/organization/subscription', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: this.props.Id
            })
        }).then((response) => {
            if(response.ok){
                response.json().then(function (responseBody) {
                   if(responseBody.subbed == 'true'){
                        //new subscriber!
                        that.setState({
                            subscribed: true,
                            subscribers: that.state.subscribers + 1,
                        });
                   }else{
                       // unsubscriber :(
                        that.setState({
                            subscribed: false,
                            subscribers: that.state.subscribers - 1,
                        });
                   }
                });
            }
            else{
                alert('Problem subscribing to '+that.state.name+'.');
            }
        })
        .catch((err) => {
            console.error('OrganizationSub() Error caught: ',err);
        });
    }

    SubscribeButton(){
        if(this.state.subscribed){
            //Display a subscribed button
            return(
                <TouchableOpacity style={styles.SubscribeButton}
                    onPress={() => {Alert.alert(
                        'Unsubscribe',
                        'Are you sure you want to unsubscribe from '+this.state.name+ '?',
                        [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'OK', onPress: () => {this.OrganizationSub()}},
                        ],
                        { cancelable: true }
                    )}}>
                    <Text style={{color:'#fff'}} >Subscribed</Text>
                    <Iconz name="md-checkmark" style={{paddingLeft: 5}} color ="#fff" size={20}/>
                </TouchableOpacity>
            );
        }else{
            return(
                <TouchableOpacity style={styles.SubscribeButton }  onPress={() => {this.OrganizationSub()}}>
                    <Text style={{color:'#fff', fontWeight:'bold' }}>Subscribe</Text>
                </TouchableOpacity>
            );
        }
    }

    render() {
        if(!this.state.ready){
            return null;
        }
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var wide = Dimensions.get('window').width;
        return (
            <View style={styles.bodyView}>
                <View style={{ justifyContent:'space-between', flexDirection:'row', alignItems: 'stretch'}}>
                    <Text style={{paddingTop: 15, marginLeft: 15, fontSize:14}}>Current subscribers: {this.state.subscribers.numberWithCommas()}</Text>
                    {this.SubscribeButton()}
                </View>

                <Text numberOfLines={5} style={{fontSize:14,  marginHorizontal: 30, marginVertical:10}}>{this.state.description}</Text>

                <View style={styles.hr}/>
                <View>
                    <Text style ={[styles.TextTitle, {textDecorationLine: 'underline'}]}> Upcoming Events </Text>
                </View>

                <Agenda
                    items={this.state.upcomingEvents}
                    selected={this.state.selected}
                    minDate={yesterday}
                    pastScrollRange={1}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={() => {return (<View />);}}
                    rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
                    // markingType={'period'}
                    style= {{width: wide}}
                    theme={{
                        selectedDayBackgroundColor: '#6b52ae',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#6b52ae',
                        dotColor: '#6b52ae',
                        selectedDotColor: '#ffffff',
                        agendaKnobColor: '#6b52ae'
                      }}
                />
            </View>
        );
    }
    renderItem(item) {
        let minHeight = 90, maxHeight = 200;
        //Map differing time lengths to height on agenda (Max out at 5 hours)
        let hours = (item.end.getTime() - item.start.getTime()) /3600000;
        let setHeight = Math.floor(minHeight+ (maxHeight-minHeight) * (hours/5));
        return (
            <View style={[styles.agendaItem, {height: setHeight}]}>
                <Text style={{fontSize:16,  fontWeight: 'bold'}}>{item.event}</Text>
               <Text style={{fontSize:14, fontWeight: 'bold'}}> {item.start.neatTime()} - {item.end.neatTime()} </Text>
               <Text>{item.description}</Text>
            </View>
        );
    }

    
}

