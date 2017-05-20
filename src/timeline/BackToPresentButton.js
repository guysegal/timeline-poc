import React from 'react';
import {Button} from 'react-native';
import {connect} from 'react-redux';

const BackToPresentButton = ({onButtonClicked}) =>
    <Button title="*"  color="black" onPress={() => onButtonClicked() }/>

const mapDispatchToProps = dispatch => ({
    onButtonClicked: () => {
        dispatch({type: "SCROLL_TO_STOP_POSITION", payload: true})
    }
})

export default connect(null, mapDispatchToProps)(BackToPresentButton)