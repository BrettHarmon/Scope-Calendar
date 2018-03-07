import React from 'react';
import {View, Image} from 'react-native';

var styles = require('../Styles.js');


export class LoadingSpinner extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
      return (
      <View style={[{justifyContent:'center', alignItems: 'center'}, styles.container]}>
        <Image source={require('../images/loadingSpinner.gif')} />
      </View>
    );
  }
}
