
import React from 'react';
import {Button, Dimensions, ScrollView, Text, View, AsyncStorage} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import update from 'immutability-helper';

var styles = require('./Styles.js');
var utility = require('./fnUtils.js');
import * as Settings from './Settings.js'

import { LoadingSpinner } from './components/loadingSpinner.js'

export class DetailsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        ready: false,
        calendarData: {},
        selected: null,
    };
    this.colors = ['#00FFFF','#8B008B','#FFA500','springgreen','darkslateblue','seagreen','brown','darkgray','olive','deeppink'];
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
              pastScrollRange={today.getMonth()} //Cant scroll past this year
              markingType={'multi-dot'}
              showScrollIndicator={true}
              displayLoadingIndicator= {true}
              theme={{
                todayTextColor: '#6b52ae',
                selectedDayBackgroundColor: '#6b52ae',
                selectedDotColor: '#ffffff',
              }}
            />
          </View>

          <View style={styles.hr} />

          <ScrollView style={{padding:15}}>
                {this.DayEvents()}
          </ScrollView>
      </View>

    );
  }

  DayEvents(){
      var day = this.state.selected;
      console.log(this.state.calendarData[day])
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
                  <Text style={[styles.TextTitle, {marginBottom: 10}]}>There are no events on {this.state.selected}.</Text>
                </View>
            )
      }

      return (
          <View>
            <Text style={[styles.TextTitle, {marginBottom: 10}]}>Events for {this.state.selected}</Text>

            {Object.getOwnPropertyNames(this.state.calendarData[day].events).map((org, i) =>
                this.OrgEventList(org, i)
            )}

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
            let dayKey = new Date(event.startDate.millis).UTCToString();
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
              start : new Date(event.startDate.millis),
              end : new Date(event.endDate.millis),
            });
        });
    });
    return data;
  }

  onDayPress(day) {
      //TODO: remove all 'selected' entries - deselect all
      var calenderData = Object.assign({}, this.state.calendarData);
      /*
      Object.getOwnPropertyNames(calenderData).forEach((date) =>{
          calenderData[date];
          if (calenderData[date].hasOwnProperty('selected')){
              delete calenderData[date].selected;
          }
      })

      if ( calenderData["2018-03-15"].hasOwnProperty('selected')){
          delete  calenderData["2018-03-15"].selected;
          calenderData["2018-03-15"] = {};
      }*/

      //const _selectedDay = moment(day.dateString).format(_format);

     let selected = true;
     if (calenderData[day.dateString]) {
       // Already in marked dates, so reverse current marked state
       selected = !calenderData[day.dateString].selected;
     }

     // Create a new object using object property spread since it should be immutable
     const updatedSelect = {...calenderData[day.dateString], ...{ selected } }
     const updatedMarkedDates = {...this.state.calendarData, ...{ [day.dateString]:  updatedSelect  } }
     //console.log(updatedMarkedDates);

     // Triggers component to render again, picking up the new state
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

export class LoggedInHome extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    static navigationOptions = {
        title: 'Home'
    }


  render() {
    /*return (
      <View style={styles.container}>
        //{this.exprender()}
      </View>
       );*/
    return (
      <View style={{ flex: 1}}>
          <Text style= {{fontSize:20, textAlign: 'center'}}> Welcome {this.props.username}!</Text>
          <Button
              title="Create Organization"
              onPress={() => this.props.navigation.navigate('CreateOrganization')}
          />
          <Calendar
          markedDates={{
                '2018-02-12': {marked: true, dotColor: 'red', activeOpacity: 0}
            }}
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              height: 350
            }}
            theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#00adf5',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#00adf5',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#00adf5',
                selectedDotColor: '#ffffff',
                arrowColor: 'orange',
                monthTextColor: 'blue',
                textDayFontFamily: 'monospace',
                textMonthFontFamily: 'monospace',
                textDayHeaderFontFamily: 'monospace',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16
            }}
          />
          <Button
            title="Test Organization Profile"
            onPress={() => {
              this.props.navigation.navigate('TestOrganizationProfile', {
                OrganizationId: 2
              });
            }}
          />
      </View>
    );
  }

  exprender(){
      return (
        <ScrollView style={styles.container}>
          <Text style={styles.text}>Calendar with selectable date and arrows</Text>
          <Calendar
            onDayPress={this.onDayPress.bind(this)}
            style={styles.calendar}
            hideExtraDays
            markedDates={{[this.state.selected]: {selected: true, disableTouchEvent: true, selectedColor: '#6b52ae'}}}
          />
          <Text style={styles.text}>Calendar with marked dates and hidden arrows</Text>
          <Calendar
            style={styles.calendar}
            current={'2012-05-16'}
            minDate={'2012-05-10'}
            maxDate={'2012-05-29'}
            firstDay={1}
            markedDates={{
              '2012-05-23': {selected: true, marked: true},
              '2012-05-24': {selected: true, marked: true, dotColor: 'green'},
              '2012-05-25': {marked: true, dotColor: 'red'},
              '2012-05-26': {marked: true},
              '2012-05-27': {disabled: true, activeOpacity: 0}
            }}
            // disabledByDefault={true}
            hideArrows={true}
          />
          <Text style={styles.text}>Calendar with custom day component</Text>
          <Calendar
            style={[styles.calendar, {height: 300}]}
            dayComponent={({date, state}) => {
              return (<View style={{flex: 1}}><Text style={{textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black'}}>{date.day}</Text></View>);
            }}
          />
          <Text style={styles.text}>Calendar with period marking and spinner</Text>
          <Calendar
            style={styles.calendar}
            current={'2012-05-16'}
            minDate={'2012-05-10'}
            displayLoadingIndicator
            markingType={'period'}
            theme={{
              calendarBackground: '#333248',
              textSectionTitleColor: 'white',
              dayTextColor: 'red',
              todayTextColor: 'white',
              selectedDayTextColor: 'white',
              monthTextColor: 'white',
              selectedDayBackgroundColor: '#333248',
              arrowColor: 'white',
              // textDisabledColor: 'red',
              'stylesheet.calendar.header': {
                week: {
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }
              }
            }}
            markedDates={{
              '2012-05-17': {disabled: true},
              '2012-05-08': {textColor: '#666'},
              '2012-05-09': {textColor: '#666'},
              '2012-05-14': {startingDay: true, color: 'blue', endingDay: true},
              '2012-05-21': {startingDay: true, color: 'blue'},
              '2012-05-22': {endingDay: true, color: 'gray'},
              '2012-05-24': {startingDay: true, color: 'gray'},
              '2012-05-25': {color: 'gray'},
              '2012-05-26': {endingDay: true, color: 'gray'}}}
            hideArrows={false}
          />
          <Text style={styles.text}>Calendar with multi-dot marking</Text>
          <Calendar
            style={styles.calendar}
            current={'2012-05-16'}
            markingType={'multi-dot'}
            markedDates={{
              '2012-05-08': {dots:  []},
              '2012-05-07': {dots: [{key: 'vacation', color: 'blue', selectedColor: 'red'}, {key: 'massage', color: 'red', selectedColor: 'blue'}]}
            }}
            hideArrows={false}
          />
          <Text style={styles.text}>Calendar with week numbers</Text>
          <Calendar
            onDayPress={this.onDayPress.bind(this)}
            style={styles.calendar}
            hideExtraDays
            showWeekNumbers
            markedDates={{[this.state.selected]: {selected: true}}}
          />
        </ScrollView>

      );
  }



  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
    console.log(day, 'selected');
  }

}
