import React from 'react';
import { Text,Button,View,AsyncStorage, DeviceEventEmitter} from 'react-native';
import {StackNavigator} from 'react-navigation'; //https://reactnavigation.org/
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
//var styles = require('./Styles.js');
var Storage = require('./IStorage.js');

//import * as Settings from './Settings.js' //Include on every page
//import Nav from './Nav'
import { CreateAccountScreen } from './CreateAccount'
import { DetailsScreen } from './Index'
import { LoggedInHome } from './Index'
import { LoginScreen } from './temp'


class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
    };

    constructor(props) {
        super(props);
        let info = {};
        Storage.del('UserInfo');//('UserInfo', (error) => console.log(error));
        let test = Storage.get('UserInfo');
        console.log(test);
         //AsyncStorage.getItem(('UserInfo'), (errors, value) =>{ info = value});
         //console.log(info);
         //let obj = JSON.parse(info);
         //console.log(obj.id);
         this.state = {
             id : info.id,
             username : info.username,
         };
         //Create a refresh listener
         // (HomeScreen shouldn't be constructed more than once)
         DeviceEventEmitter.addListener('refreshHome', (e)=>{
             this.buildCookies(this);
         });
    }



     //will rebuild login cookies and refresh homescreen with setState()
     buildCookies(props){
        let info = {};
        AsyncStorage.getItem(('UserInfo'), (errors, value) => {});
        props.setState({
            id : info.id,
            username : info.username,
        });
         console.log('Refreshing homepage...', props.state.id);
     }

  render() {
    return (
        <View style={{ flex: 1}}>
        {this.HomeGreeting()}

        <Button
          title="Sign Up"
          onPress={() => this.props.navigation.navigate('Login')}
        />

        </View>
    );
  }


    //Decides if a user is logged in or not
    HomeGreeting() {
        var that = this;
        if(!this.state.username){
            //Try one more time to get UserInfo
            //AsyncStorage.getItem(('UserInfo'), (errors, value) => {that.setState({userInfo : value}));
        }
        console.log(this.state.username);
        if(!!this.state.username){
            console.log("logged in")
            //Logged in
            return(<LoggedInHome/>);
        }
        else{
            console.log("not logged in")
            return(
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                      title="Sign Up"
                      onPress={() => this.props.navigation.navigate('CreateAccount')}
                    />
                </View>
            );
        }
    }
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
    CreateAccount: {
        screen: CreateAccountScreen,
    },
    Created: {
        screen: LoggedInHome,
    },
    Login: {
        screen: LoginScreen,
    }
  },
  {
    initialRouteName: 'Home',
    //initialRouteName: 'Created', //TODO delete me
    navigationOptions: {
     headerStyle: {
       backgroundColor: '#f4511e',
     },
     headerTintColor: '#fff',
     headerTitleStyle: {
       fontWeight: 'bold',
     },
 },
  }
);

export default RootStack;
