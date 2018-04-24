
'use strict';
import React from 'react';
import { StyleSheet} from 'react-native';


export const PURPLE = "#6b52ae";
export const yee = "#ecd7ff";

module.exports = StyleSheet.create({
    //FlexBox styling
    FlexBoxContainerEvenRowSpacing: {
        flexWrap: 'wrap',
        flexDirection:'row',
        justifyContent:'space-around'
    },
    FlexBoxRowElement: {
        flex:1,
        flexWrap: 'wrap',
        paddingHorizontal: 3
    },
    //

    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 350
    },
    text: {
        textAlign: 'center',
        borderColor: '#bbb',
        padding: 10,
        backgroundColor: '#eee'
    },


    SubscribeButton:{
        borderRadius: 6,
        backgroundColor: PURPLE,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 5,
        marginRight: 10,
        width: 150,
        flexWrap: 'wrap',
        flexDirection:'row',
        justifyContent:'center',
        alignSelf: 'flex-end',
    },
    hr: {
        height:10,
        backgroundColor:'#efefef'
    },
    TextTitle: {
        fontSize: 24,
        paddingVertical: 7,
        textAlign: 'center',
    },
    TInput: {
        fontSize:18,
        paddingLeft: 5,
        paddingBottom: 7,
    },
    TInputLabel:{
        paddingVertical: 3,
        paddingLeft: 5,
        color: "#575859",
    },
    hiddenError:{
        color: "#d10000",
        paddingTop: 4,
        paddingHorizontal: 20
    },
    InputSpan:{
        paddingVertical: 15,
        paddingHorizontal: 5
    },

    bodyView: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },

    agendaEmptyDate: {
        height: 15,
        flex:1,
        paddingTop: 30
    },
    agendaItem: {
        backgroundColor: '#9e8ec9',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
      },
    //organization search text styling
    organizationTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14
    },
    organizationDescription: {
        textAlign: 'center',
        fontSize: 12
    },
    organizationView: {
        width: 100,
        justifyContent: 'center',
        marginTop: 17
    },
    organizationOuterView: {
        alignItems: 'center',
    },
    organizationButton: {
        backgroundColor: "#ecd7ff",
    }
});
