/**
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons'; //https://material.io/icons/
import Iconz from 'react-native-vector-icons/Ionicons';  //https://ionicframework.com/docs/ionicons/
import * as Settings from './Settings.js'

export default class Nav extends Component {

  home(){
    return (
      <View  style={styles.container}>
      <TouchableOpacity onPress ={this.props.toProfile}>
          <Iconz name="ios-person" color ="#888" size={25} style={{margin:10}} />
      </TouchableOpacity>
      <TouchableOpacity onPress ={this.props.chat}>
          <Iconz name="ios-chatboxes-outline" color ="#555" size={25} style={{margin:10}} />
      </TouchableOpacity>
      </View>
    );
  }
  profile(){
    return (
        //TODO: Search
      <View  style={styles.container}>
      <View style = {{width:25, height:25, margin:10}}/>
          <TouchableOpacity onPress ={this.props.chat}>
              <Iconz name="md-home" color ="#555" size={25} style={{margin:10}} />
          </TouchableOpacity>
      </View>
    );
  }

    message(){
    return (
      <View  style={styles.container}>
          <View style = {{width:25, height:25, margin:10}}/>
      </View>
    );
  }
  render() {
    if(this.props.type == "message"){
        return (
          <View>{this.message()}</View>
        );}
        else if (this.props.type == "profile"){
          return (
          <View>{this.profile()}</View>
        );
        }
        else if(this.props.type == "login"){
            return (
              <View>{this.profile()}</View>
            );
        }
        else{
        return (
          <View>{this.home()}</View>
        );}
  }
}

const styles = StyleSheet.create({
  container: {
    height:60,
    flexDirection:'row',
    paddingTop:10,
    justifyContent: 'space-between',
    alignItems:'center',
    backgroundColor: '#fff',
    borderBottomWidth:1,
    borderColor:'rgba(0,0,0,0.1)'
  },
});
