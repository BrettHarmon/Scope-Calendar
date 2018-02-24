
'use strict';
import React from 'react';
import { StyleSheet} from 'react-native';



module.exports = StyleSheet.create({

    TInput: {
        fontSize:18,
        paddingLeft: 5,
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
        marginHorizontal: 25,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1
    }
});
