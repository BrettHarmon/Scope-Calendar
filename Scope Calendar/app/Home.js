
import React from 'react';
import {Button, Dimensions, ScrollView, Text, View, AsyncStorage, TouchableOpacity} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import update from 'immutability-helper';
import Iconz from 'react-native-vector-icons/Ionicons';  //https://ionicframework.com/docs/ionicons/


var styles = require('./Styles.js');
var utility = require('./fnUtils.js');
import * as Settings from './Settings.js'

import { LoadingSpinner } from './components/loadingSpinner.js'

export class LoggedInHome extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        ready: false,
        calendarData: {},
        selected: null,
    };
      this.props.navigation.setParams({subscribedOrganizations:<TouchableOpacity  onPress={() => this.props.navigation.navigate('OrganizationList')}>
          <Iconz name="md-school" color ="#fff" size={28} style={{marginRight: 20}}/>
      </TouchableOpacity>})
    this.colors = ['#00FFFF','#8B008B','#FFA500','#00FF7F','#483d8b','#54ff9f','#A0522D','#a9a9a9','#808000','#ff1493'];
  }





  componentWillMount(){
      this.UserEventFetch()
          .then((evts) => {
              if (utility.hasValue(evts)){ //evts object exists (not undefined/null/empty string)
                var parsedEvents =  this.parseEvents(evts);
                //console.log('event state: \n',parsedEvents);
                this.setState({
                    ready:true,
                    calendarData: parsedEvents,
                });

            }else{
                this.setState({
                    ready:true
                });
                console.log('No events returned from userEventFetch')
            }
          })
  }

  render() {
      if(!this.state.ready){
          return (<LoadingSpinner/>)
      }

    let today = new Date();
    var high = Math.floor(Dimensions.get('window').height * 0.65);
    return (
      <View style={styles.bodyView}>
        <View style={[styles.container, {borderWidth: 2, borderColor: '#6b52ae', borderRadius: 6}]}>
          <CalendarList
              markedDates={ this.state.calendarData }
              //markedDates={{[this.state.selected]: {selected: true, disableTouchEvent: true, selectedColor: '#6b52ae'}}}
              onDayPress={this.onDayPress.bind(this)}
              pastScrollRange={today.getMonth()+ 12}
              markingType={'multi-dot'}
              showScrollIndicator={true}
              theme={{
                todayTextColor: '#6b52ae',
                selectedDayBackgroundColor: '#6b52ae',
                selectedDotColor: '#ffffff',
              }}
            />
          </View>

          <View style={styles.hr} />

          <View style={{minHeight:200 ,paddingHorizontal:15, paddingBottom: 30}}>
                {this.DayEvents()}
          </View>
      </View>

    );
  }

  PrettyDateRender(date){
      var months = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'August', 'Sep.', 'Oct.', 'Nov.', 'Dec.']
      let day = new Date(date);
      return months[day.getUTCMonth()] + ' ' + day.getUTCDate() + ', ' + day.getFullYear();
  }

  DayEvents(){
      var day = this.state.selected;
      //console.log(this.state.calendarData[day])
      if(this.state.selected == null){
          return (
              <View>
                <Text style={styles.TextTitle}> Select a day on the calendar to see events </Text>
              </View>
          )
      }
      // no events, nothing to be rendered TODO: Check 'hidden' organizations
      if(!this.state.calendarData[day].events){
            return(
                <View>
                  <Text style={[styles.TextTitle, {marginBottom: 10}]}>No events planned on {this.PrettyDateRender(this.state.selected)}.</Text>
                </View>
            )
      }

      return (
          <View>
            <Text style={[styles.TextTitle, {marginBottom: 7}]}>Events for {this.PrettyDateRender(this.state.selected)}</Text>
            <ScrollView style={{maxHeight: 400}}>
                {Object.getOwnPropertyNames(this.state.calendarData[day].events).map((org, i) =>
                    this.OrgEventList(org, i)
                )}
            </ScrollView>
          </View>
      )
  }
  OrgEventList(name, i){
      var backgroundColor = this.state.calendarData[this.state.selected].dots.find(dots => dots.key == name).color;
      let childBG = backgroundColor + '66' //Add a .4 opacity
      backgroundColor += 'A6' //Add a .65 opacity
      return (
          <View key={i} style={{paddingHorizontal: 20, borderRadius: 7, borderWidth: 1.5, backgroundColor: backgroundColor}}>
              <Text style= {{textAlign:'center', fontSize:20, paddingVertical: 10}}>{name}</Text>
              {this.state.calendarData[this.state.selected].events[name].map((evt, j) =>
                  this.EventItem(evt,j,childBG)
                )}
          </View>

      )
  }
  EventItem(evt, i, background){
      return (
          <View key={i+100} style={{backgroundColor: background, padding:10, marginVertical: 8}}>
            <Text style={{fontSize:18, fontWeight: 'bold'}}>Event: {evt.event}</Text>
            <Text style={{fontSize:14, fontWeight: 'bold'}} >{evt.start.neatTime()} - {evt.end.neatTime()} </Text>
            <Text numberOfLines={10}> {evt.description}</Text>
          </View>
      )
  }

  UserEventFetch(){
      return fetch( Settings.HOME_URL + '/user/getevents', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
        })
          .then((response) => {
              if(response.ok) {
                  return response.json().then(function (body) {
                      //console.log(body);
                      return body;
                    })
                }
              return null;
          }).catch((error) => {
              console.log('Error with UserEventFetch');
          });
  }

  /** pass events as array or objects containing .name and .events as array of dates
  /     So... a object passed here (directly from user/getevents) looks like
  /    Obj : {
            Organization1: Array [
                Obj : {
                        event_1: ... (Event object direct from backend)
                        event_2: ...
                    }
            ]
            Organization2: Array [
                ...
            ]
      }
  */
  parseEvents(events){
    let today = new Date();
    let data = {};
    Object.getOwnPropertyNames(events).forEach((orgs, idx) => {
        var orgName = orgs;
        let orgInfo = {key:orgName, color: this.colors[idx], colorIndex: idx};

        events[orgName].forEach((event) => {
            let dayKey = new Date(event.startDate.millis+ (event.timezoneOffset *3600000)).UTCToString();
            // initialize data object element
            if(!data[dayKey]){
                data[dayKey] = { dots: [], events: {}};
            }
            // initialize event array if not
            if(!data[dayKey].events[orgName]){
              data[dayKey].events[orgName] = [];
            }

            // Store org marking info if not there prior
            if(!data[dayKey].dots.find(dots => dots.key == orgName)){
              data[dayKey].dots.push(orgInfo);
            }

            data[dayKey].events[orgName].push({
              event: event.name,
              description: event.description,
              start : new Date(event.startDate.millis + (event.timezoneOffset *3600000) ),
              end : new Date(event.endDate.millis + (event.timezoneOffset *3600000) ),
            });
        });
    });
    return data;
  }

  onDayPress(day) {
      var calenderData = Object.assign({}, this.state.calendarData);
      //set all days to false (that isnt selected date)
      let displaySelector = [];
      Object.getOwnPropertyNames(calenderData).forEach((date) =>{
          if (calenderData[date].hasOwnProperty('selected')){
              if(date != day.dateString)
                displaySelector.push(date);
          }
     });

     var selectionUpdates = {};
     for(var i=0; i<displaySelector.length; i++)
     {
        let selected =  false;
        const delectDay = {...calenderData[displaySelector[i]], ...{selected}};
        selectionUpdates = {...selectionUpdates, ...{ [displaySelector[i]]:  delectDay  } };

     }
     let selected = true;
     if (calenderData[day.dateString]) {
       // Already in marked dates, so reverse current marked state
       selected = !calenderData[day.dateString].selected;
     }
     const updatedSelect = {...calenderData[day.dateString], ...{ selected } };
     const updatedMarkedDates = {...this.state.calendarData, ...selectionUpdates, ...{ [day.dateString]:  updatedSelect  } };
     this.setState({ calendarData: updatedMarkedDates, selected: day.dateString });
  }


}

export class NotLoggedInHome extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
        <View style={{flex: 1,  marginHorizontal: 20, marginVertical: 10, backgroundColor: '#fff', justifyContent:'center'}}>

          <Text style={[{marginBottom: 10}, styles.TextTitle]}>Welcome to Scope Calendar!</Text>

          <View style={styles.FlexBoxContainerEvenRowSpacing}>
            <View style={styles.FlexBoxRowElement}>
              <Text style={{height:50, textAlign:'center'}}>Get started by creating an account.</Text>
              <Button
                title="Sign Up"
                onPress={() => this.props.navigation.navigate('CreateAccount')}
                color= {'#6b52ae'}
              />
            </View>

            <View style={styles.FlexBoxRowElement}>
              <Text style={{height:50, textAlign:'center'}}>Existing user? Log in to access your calendar.</Text>
              <Button
                title="Login"
                onPress={() => this.props.navigation.navigate('Login')}
                color= {'#6b52ae'}
              />
            </View>

          </View>

      </View>
    );

  }
}

export class testView extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
        return(
            <View style={styles.container}>

            </View>
        )
    }
}
