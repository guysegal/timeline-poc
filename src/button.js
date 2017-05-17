import React from 'react';
import {Button} from 'react-native';
import {connect} from 'react-redux';

const ButtonView = ({onButtonClicked}) =>
    <Button title="*"  color="black" onPress={() => onButtonClicked() }/>

const mapDispatchToProps = dispatch => ({
    onButtonClicked: () => {
        console.log("clicked")
        dispatch({type: "BUTTON_PRESSED", payload: true})
    }
})

export default connect(null, mapDispatchToProps)(ButtonView)