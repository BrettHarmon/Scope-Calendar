import React from 'react';
import {TouchableOpacity, StyleSheet, ScrollView, Text, View, TextInput, Button, AsyncStorage, DeviceEventEmitter } from 'react-native';
import {StackNavigator} from 'react-navigation';
import * as Keychain from 'react-native-keychain';

import * as Settings from './Settings.js' //Include on every page
var styles = require('./Styles.js');


export class OrganizationListScreen extends React.Component {
    static navigationOptions = {
        title: 'Organizations',
    };
    render() {
        return (
            <View style={styles.container}>
                <OrganizationListBox navigation={this.props.navigation}/>
            </View>
        );
    }
}

class OrganizationListBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {organizations: [],};
    }

    componentDidMount() {
        let that = this;
        return fetch( Settings.HOME_URL + '/organization/subscribed')
            .then((response) => response.json())
            .then((responseJson) => {
                that.setState({organizations: responseJson});
               // console.log(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    }


    render() {
        let that = this;
        return (
            <View style={styles.bodyView}>
                <Text>Organizations You Are Subscribed To</Text>
                <ScrollView>
                    {
                        this.state.organizations.map(function (item, i) {
                            console.log(item.organizationId);
                            return <View key={i}>
                                <Button
                                    title={item.name}
                                    onPress={() => {
                                        that.props.navigation.navigate('TestOrganizationProfile', {
                                            OrganizationId: item.organizationId
                                        });
                                    }}
                                />
                            </View>
                        })
                    }
                </ScrollView>
            </View>

        )
    }


}