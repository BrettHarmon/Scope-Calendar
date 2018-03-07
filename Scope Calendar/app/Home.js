
import React from 'react';
import {Button, Dimensions, ScrollView, Text, View, AsyncStorage} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

var styles = require('./Styles.js');
import * as Settings from './Settings.js'
export class DetailsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render() {
    this.parseEvents([]);
    let today = new Date();
    var high = Math.floor(Dimensions.get('window').height * 0.65);
    return (
      <View style={styles.bodyView}>
        <View style={[styles.container, {borderWidth: 2, borderColor: '#6b52ae', borderRadius: 6}]}>
          <CalendarList
              onDayPress={this.onDayPress.bind(this)}
              pastScrollRange={today.getMonth()} //Cant scroll past this year
              markedDates={{[this.state.selected]: {selected: true, disableTouchEvent: true, selectedColor: '#6b52ae'}}}
              markingType={'multi-dot'}
              theme={{
                todayTextColor: '#6b52ae',
                selectedDayBackgroundColor: '#6b52ae',
              }}
            />
          </View>

          <View style={styles.hr} />

          <ScrollView style={[styles.calendar, {paddingHorizontal: 15, paddingVertical:10, height: high}]}>
            <Text>.</Text>
          </ScrollView>
      </View>
      
    );
  }

  //pass events as array or objects containing .name and .events as array of dates
  parseEvents(events){
    const colors = ['cyan','DarkMagenta','orange','springgreen','darkslateblue','seagreen','brown','darkgray','olive','deeppink'];
    let today = new Date();
    
    let data = {};
    //initialize all events with empty array for next 3 months
    for (let i = -7; i < 90; i++) {
      let time = today.getTime() + i * 24 * 60 * 60 * 1000;
      let strTime = Settings.timeToString(time);
      data[strTime] =  {dots:  [], events: {} };  
    }

    events.forEach((orgEvts, idx) => {
      let name = orgEvts.name;
      let orgInfo = {key:name, color: colors[idx]};
      orgEvts.forEach((event) => {
        let dayKey = new Date(event.startDate.millis).UTCToString();
        let dataDots = data[dayKey].dots;
        if(!dataDots.filter(dots => dots.key == name)){
          //could not find an event by same organization on this day
          data[dataKey].dots.push(orgInfo);
        }
        if(!data[dataKey].events[name]){
          data[dataKey].events[name] = [];
        }
        data[dataKey].events[name].push({
          event: event.name,
          description: event.description,
          start : new Date(event.startDate.millis),
          end : new Date(event.endDate.millis),
        });
      });
    }); 
    console.log(data);
    //TODO set state;
    return data;
  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
    console.log(day, 'selected');
  }

}
export class DayEvent extends React.Component {
  render(){
    return(
      <View>
      {Object.entries(this.props.events).map(([org, evts]) => {return this.EventList(org, evts) })}
      </View>
    )
  }

  EventList(org, events){
    return(
      <View>
      </View>
    )
  }

}
export class NotLoggedInHome extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
        <View style={{flex: 1,  marginHorizontal: 20, marginVertical: 10, backgroundColor: '#fff', justifyContent:'center'}}>

          <Text style={[{marginTop: 10}, styles.titleText]}>Welcome to Scope Calendar!</Text>

          <View style={styles.FlexBoxContainerEvenRowSpacing}>
            <View style={styles.FlexBoxRowElement}>
              <Text style={{textAlign:'center'}}>Get started by creating an account.</Text>
              <Button
                title="Sign Up"
                onPress={() => this.props.navigation.navigate('CreateAccount')}
              />
            </View>

            <View style={styles.FlexBoxRowElement}>
              <Text style={{textAlign:'center'}}>Existing user? Log in to access your calendar.</Text>
              <Button
                title="Login"
                onPress={() => this.props.navigation.navigate('Login')}
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
    return (
      <View style={styles.container}>
        {this.exprender()}
      </View>
       );
    /*return (
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
    );*/
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
  }

}
