
'use strict';
import React from 'react';
import { StyleSheet} from 'react-native';


var purp = '#6b52ae';
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

    SubscribeButton:{
        borderRadius: 6,
        backgroundColor: purp,
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
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
      },
});
