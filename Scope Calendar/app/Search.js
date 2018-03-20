import React from 'react';
import {TouchableOpacity, StyleSheet, ScrollView, Text, View, TextInput, Button, AsyncStorage, DeviceEventEmitter } from 'react-native';
import {StackNavigator} from 'react-navigation';
import * as Keychain from 'react-native-keychain';

var utility = require('./fnUtils.js');
import * as Settings from './Settings.js' //Include on every page
var styles = require('./Styles.js');


export class SearchScreen extends React.Component {
    static navigationOptions = {
        title: 'Search Organizations',
    };
    render() {
        return (
            <View style={styles.container}>
                <SearchBox navigation={this.props.navigation}/>
            </View>
        );
    }
}

class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {organizations: [],
                      searchBox: '',};
    }

    searchOrganizations() {
        let that = this;
        let searchBox = that.state.searchBox;
        return fetch( Settings.HOME_URL + '/organization/search/' + searchBox)
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
            <View style= {styles.InputSpan}>
                <Text style= {styles.TInputLabel}>Name</Text>
                <TextInput
                    style = {styles.TInput}
                    onChangeText={(searchBox) => this.setState({searchBox})}
                    value={this.state.searchBox}
                />
            </View>

            <Button title="Search Organizations" onPress={this.searchOrganizations.bind(this)} />
                {
                    this.state.showResults &&
                        <SearchResultsBox organizations={this.state.organizations}/>
                }
            </View>

        )
    }


}

class SearchResultsBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {organizations: [],};
    }


    render() {
        let that = this;
        return (
            <View style={styles.bodyView}>
                <Text>Search Organizations</Text>
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