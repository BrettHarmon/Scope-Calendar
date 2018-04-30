import React from 'react';
import {TouchableOpacity, StyleSheet, ScrollView, Text, View, TextInput, Button, AsyncStorage, DeviceEventEmitter } from 'react-native';
import {StackNavigator} from 'react-navigation';
import * as Keychain from 'react-native-keychain';
import Iconz from 'react-native-vector-icons/Ionicons';  //https://ionicframework.com/docs/ionicons/

var utility = require('./fnUtils.js');
import * as Settings from './Settings.js' //Include on every page
var styles = require('./Styles.js');


export class OrganizationListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Organizations',
            headerRight: (
                <TouchableOpacity  onPress={() => navigation.navigate('CreateOrganization')}>
                    <Iconz name="md-add" color ="#fff" size={28} style={{marginRight: 20}}/>
                </TouchableOpacity>),
        }; }
    render() {
        return (
            <View style={styles.container}>
                <OrganizationList navigation={this.props.navigation}/>
            </View>
        );
    }
}

class OrganizationList extends React.Component {
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
        if (this.state.organizations && this.state.organizations.length) {

            return (
                <View style={styles.bodyView}>
                    <Text style={styles.largeText}>Organizations You Are Subscribed To</Text>
                    <ScrollView>
                        <OrganizationListBox organizations={that.state.organizations} navigation={that.props.navigation}/>
                    </ScrollView>
                </View>

            )
        }
        else {
            return (
                <View style={styles.bodyView}>
                    <Text style={styles.largeText}>You are not subscribed to any organizations.</Text>
                    <Text style={styles.largeText}>You can search for some by clicking the button below, or adding your own with the + button above.</Text>
                    <TouchableOpacity style={styles.organizationSearchButton}  onPress={() => that.props.navigation.navigate('Search')}>
                        <Iconz name="md-search" color="#6b52ae" size={300} />
                    </TouchableOpacity>
                </View>
            )
        }
    }


}

class OrganizationListBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {organizations: this.props.organizations,};
    }


    render() {
        let that = this;
        return (
            <View style={styles.organizationOuterView}>
                <ScrollView style={{flex: 1}}>
                    {
                        this.state.organizations.map(function (item, i) {
                            console.log(item.description);
                            return <View style={styles.organizationView} key={i}>
                                <TouchableOpacity style={styles.organizationButton}
                                                  onPress={() => {
                                                      that.props.navigation.navigate('TestOrganizationProfile', {
                                                          OrganizationId: item.organizationId
                                                      });
                                                  }}>
                                    <Text style={styles.organizationTitle}>{item.name}</Text>
                                    <Text style={styles.organizationDescription}>{item.description}</Text>
                                </TouchableOpacity>


                            </View>
                        })
                    }
                </ScrollView>
            </View>

        )
    }


}
