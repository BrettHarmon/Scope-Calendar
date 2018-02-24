import React from 'react';
import {TouchableOpacity, Button, Text, View, AsyncStorage} from 'react-native';
import Iconz from 'react-native-vector-icons/Ionicons';  //https://ionicframework.com/docs/ionicons/
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export class OrganizationProfileScreen extends React.Component {
    constructor(props){
        super(props);
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
        var name,isSubbed,description,upcomingEvents;
        fetch( Settings.HOME_URL + '/organization/info', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                OrganizationId: this.props.Id
            })
        })
        .then((response) => {
            response.json().then(function (json) {
                name = json.name;
                description = json.description;
                isSubbed = isSubscribed;
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
            })
        })
        .catch(console.log("error loading organization details")); //TODO: Handle this in UI


        this.state = {
            name : name,
            subscribed: isSubbed,
            description : description,
            upcomingEvents: upcomingEvents
        };
        if(!!name){
            this.props.navigation.setParams({ title: name });
        }

    }

    static navigationOptions = {
        title: 'Organization Profile'
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
        var today = new Date();
        return (
            <View style={{ flex: 1}}>
                {this.SubscribeButton()}
                <View>
                    <Text> Upcoming Events </Text>
                </View>

                <Agenda
                  // the list of items that have to be displayed in agenda. If you want to render item as empty date
                  // the value of date key kas to be an empty array []. If there exists no value for date key it is
                  // considered that the date in question is not yet loaded
                  items={this.state.upcomingEvents}
                  // callback that gets called when items for a certain month should be loaded (month became visible)
                  loadItemsForMonth={(month) => {console.log('trigger items loading')}}
                  // callback that fires when the calendar is opened or closed
                  onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
                  // callback that gets called on day press
                  onDayPress={(day)=>{console.log('day pressed')}}
                  // callback that gets called when day changes while scrolling agenda list
                  onDayChange={(day)=>{console.log('day changed')}}
                  // initially selected day
                  selected={today.now()}
                  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                  minDate={today.now()}
                  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                  maxDate={today.getDate() + 31}
                  // Max amount of months allowed to scroll to the past. Default = 50
                  pastScrollRange={0}
                  // Max amount of months allowed to scroll to the future. Default = 50
                  futureScrollRange={12}
                  // specify how each item should be rendered in agenda
                  //renderItem={(item, firstItemInDay) => {return (<View />);}}
                  // specify how each date should be rendered. day can be undefined if the item is not first in that day.
                  //renderDay={(day, item) => {return (<View />);}}
                  // specify how empty date content with no items should be rendered
                  //renderEmptyDate={() => {return (<View />);}}
                  // specify how agenda knob should look like
                  //renderKnob={() => {return (<View />);}}
                  // specify what should be rendered instead of ActivityIndicator
                  //renderEmptyData = {() => {return (<View />);}}
                  // specify your item comparison function for increased performance
                  //rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
                  // Hide knob button. Default = false
                  //hideKnob={true}
                  // By default, agenda dates are marked if they have at least one item, but you can override this if needed
                  /*markedDates={{
                    '2012-05-16': {selected: true, marked: true},
                    '2012-05-17': {marked: true},
                    '2012-05-18': {disabled: true}
                  }}

                  // agenda theme
                  theme={{
                    ...calendarTheme,
                    agendaDayTextColor: 'yellow',
                    agendaDayNumColor: 'green',
                    agendaTodayColor: 'red',
                    agendaKnobColor: 'blue'
                  }}
                  // agenda container style
                  style={{}}
                  */
                />

            </View>
        );
    }
}
