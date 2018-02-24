
import React from 'react';
import {Button, Text, View, AsyncStorage} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
            <Button
              title="Go to Details... again"
              onPress={() => this.props.navigation.navigate('Details')}
            />
      </View>
    );
  }
}

export class NotLoggedInHome extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
              title="Sign Up"
              onPress={() => this.props.navigation.navigate('CreateAccount')}
            />

            <Button
            title="Login"
            onPress={() => this.props.navigation.navigate('Login')}
        />

             <Button
             title="Test Login"
             onPress={() => this.testLoggedin()}
         />
      </View>
    );

  }
}

export class LoggedInHome extends React.Component {
    constructor(props){
        super(props);
    }
    static navigationOptions = {
        title: 'Home'
    }
  render() {
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

      </View>
    );
  }
}
