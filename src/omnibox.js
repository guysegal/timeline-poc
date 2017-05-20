import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux'
import {compose, mapProps} from 'recompose';
import uuid from 'react-native-uuid';
import R from 'ramda';

const renderOnlyWhen = predicate => Component => props => predicate(props) ? <Component {...props} /> : null;

class Omnibox extends React.PureComponent {
    render() {
       return  <View style={{width: 200, height: 50, backgroundColor: "green", margin: 10}} />
    }
}

const DockedOmnibox = props =>
    <View style={{justifyContent: 'flex-start', flexGrow: 1, maxHeight: 50, backgroundColor: "yellow"}} />;

export default Omnibox;

export const UpperDockedOmnibox = compose(
    connect(state => ({shouldShowUpperDockedOmnibox: state.shouldShowUpperDockedOmnibox})),
    renderOnlyWhen((props) => {
        return props.shouldShowUpperDockedOmnibox
    })
)(DockedOmnibox);