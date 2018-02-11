import React from 'react';
import { Image,Text,Button,TextInput,TouchableOpacity,View,} from 'react-native';
import {StackNavigator} from 'react-navigation'; //https://reactnavigation.org/docs
var styles = require('./Styles.js');

//import * as Settings from './Settings.js' //Include on every page
//import Nav from './Nav'
import { CreateAccountScreen } from './CreateAccount'
import { DetailsScreen } from './Index'
import { LoggedInHome } from './Index'






class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
    };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
            <Button
              title="Sign Up"
              onPress={() => this.props.navigation.navigate('CreateAccount')}
            />
      </View>
    );
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

/*export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}*/








/*export default class App extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        <Home></Home>
    }
}*/

/*class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() =>
          navigate('Profile', { name: 'Jane' })
        }
      />
    );
  }
}*/

    /*renderScene(route, navigator) {
      var {state,actions} = this.props;
      var routeId = route.id;
      //every view gets an route name (might want to great ENUM list)
      if (routeId === 'home') {
        return (
          <Home
          {...this.props}
          userData ={route.userData}
          navigator={navigator}
          />
          );
      }
      /*if (routeId === 'signup') {
        return (
          <Messages
          {...this.props}
          userData ={route.userData}
          navigator={navigator} />
          );
      }*/



    /*render() {
        return (
          <View style={{flex:1}}>
               <Navigator
               style={{flex: 1}}
               ref={'NAV'}
               initialRoute={{id: 'home', name: 'home'}}
               renderScene={this.renderScene.bind(this)}/>
           </View>
          )
      }*/



    /*
    constructor(props) {
        super(props);
        this.state = {userId: ''};
        this.userLoggedIn = this.userLoggedIn.bind(this);
    }

    userLoggedIn(userId) {
        this.setState({userId: userId});
    }
  render() {
        if (this.state.userId == '') {
    return (
      <View>
        <Text>Welcome to Scope Calendar</Text>
        <Text>Changes you make will automatically reload.</Text>
        <LoginBox loggedIn={this.userLoggedIn}></LoginBox>
          <Text> {this.state.userId} </Text>
      </View>
    ); }
    else {
            return (
                <View>
                    <Text>Welcome to Scope Calendar</Text>
                    <Text>You have been logged in</Text>
                    <Text> Welcome {this.state.userId.username}! </Text>
                </View>
            );
        }
  }
  */
