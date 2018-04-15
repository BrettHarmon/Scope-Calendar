import React from 'react';
import {TouchableOpacity, StyleSheet, ScrollView, Text, View, TextInput, Button, AsyncStorage, DeviceEventEmitter } from 'react-native';
import {StackNavigator} from 'react-navigation';
import * as Keychain from 'react-native-keychain';
import AutoTags from 'react-native-tag-autocomplete';
import { Switch } from 'react-native-switch';

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
                      searchBox: '',
                      showResults: false,
                      suggestions: [],
                      tags: [],
                      view: 'byTags',};
    }

    componentDidMount() {
        let that = this;
        return fetch( Settings.HOME_URL + '/organization/tags')
            .then((response) => response.json())
            .then((responseJson) => {
                var suggestions = [];
                responseJson.map(object => suggestions.push({name: object}));
                that.setState({suggestions: suggestions});
            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleDelete = index => {
        let tags = this.state.tags;
        tags.splice(index, 1);
        this.setState({ tags });
    };

    handleAddition = suggestion => {
        this.setState({ tags: this.state.tags.concat([suggestion]) });
    };

    searchOrganizationsByName() {
        this.setState({showResults: false});
        let searchBox = this.state.searchBox;
        return fetch( Settings.HOME_URL + '/organization/searchByName/' + searchBox)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({organizations: responseJson, showResults: true});

                 console.log(this.state.organizations);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    searchOrganizationsByTags() {
        this.setState({showResults: false});
        let tags = this.state.tags.map(object => object.name);
        return fetch( Settings.HOME_URL + '/organization/searchByTags/' + tags)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({organizations: responseJson, showResults: true});

                console.log(this.state.organizations);
            })
            .catch((error) => {
                console.error(error);
            });
    }


    render() {
        let that = this;
        if (this.state.view === 'byName') {
            return (
                <View style={styles.bodyView}>
                    <Button title="Search by Tags" onPress={(event) =>this.setState({view: 'byTags', showResults: false})}/>
                    <View style={styles.InputSpan}>
                        <Text style={styles.TInputLabel}>Search by Name</Text>
                        <TextInput
                            style={styles.TInput}
                            onChangeText={(searchBox) => this.setState({searchBox})}
                            value={this.state.searchBox}
                        />
                    </View>

                    <Button title="Search Organizations" onPress={this.searchOrganizationsByName.bind(this)}/>
                    {
                        this.state.showResults &&
                        <SearchResultsBox organizations={this.state.organizations} navigation={this.props.navigation}/>
                    }
                </View>

            )
        } else {
            return (
              <View style={styles.bodyView}>
                <Button title="Search by Name" onPress={(event) =>this.setState({view: 'byName', showResults: false})}/>
                <View style= {styles.InputSpan}>
                    <Text style= {styles.TInputLabel}>Search by Tags</Text>
                    <AutoTags
                        suggestions={this.state.suggestions}
                        tagsSelected={this.state.tags}
                        handleAddition={this.handleAddition}
                        handleDelete={this.handleDelete}
                        placeholder="Add a Tag.." />
                </View>
                  <Button title="Search Organizations" onPress={this.searchOrganizationsByTags.bind(this)}/>
                  {
                      this.state.showResults &&
                      <SearchResultsBox organizations={this.state.organizations} navigation={this.props.navigation}/>
                  }
              </View>



            )
        }
    }


}

class SearchResultsBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {organizations: this.props.organizations,};
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