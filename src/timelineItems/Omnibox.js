import React from 'react';
import {View} from 'react-native';
import {compose, withState} from 'recompose';
import {connectActionStream} from 'modules/redux-action-stream';

const renderOnlyWhen = predicate => Component => props => predicate(props) ? <Component {...props} /> : null;

const Omnibox = (props) => 
    (<View style={{width: 200, height: 50, backgroundColor: "green", margin: 10}} />)

const DockedOmnibox = props =>
    <View style={{justifyContent: 'flex-start', flexGrow: 1, maxHeight: 50, backgroundColor: "yellow"}} />;

const listenFuture = connectActionStream((action$, getProps) => [
    action$.on("ONLY_FUTURE_ITEMS_ARE_VISIBLE", events$ => {        
        return events$.subscribe(action => {
            getProps().setShouldShowUpperDockedOmnibox(action.payload);
        })
    })
])

const listenPast = connectActionStream((action$, getProps) => [
    action$.on("ONLY_PAST_ITEMS_ARE_VISIBLE", events$ => {   
        return events$.subscribe(action => {
            getProps().setShouldShowLowerDockedOmnibox(action.payload);
        })
    })
]) 

export const UpperDockedOmnibox = compose(
    withState("shouldShowUpperDockedOmnibox", "setShouldShowUpperDockedOmnibox", false),
    listenFuture,
    renderOnlyWhen((props) => {
        return props.shouldShowUpperDockedOmnibox
    })
)(DockedOmnibox);

export const LowerDockedOmnibox = compose(
    withState("shouldShowLowerDockedOmnibox", "setShouldShowLowerDockedOmnibox", false),
    listenPast,
    renderOnlyWhen((props) => {
        return props.shouldShowLowerDockedOmnibox
    })
)(DockedOmnibox);

export default Omnibox;