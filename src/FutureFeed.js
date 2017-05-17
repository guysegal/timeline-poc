import React from 'react';
import {View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {connectActionStream} from 'redux-action-stream';
import {Observable} from 'rx'
import {compose, withState} from 'recompose';

import Omnibox from './omnibox';
import withFutureItems from './hoc/withFutureItems';
import {withRenderTimelineItem} from './timelineItemsFactory';


const withActionStream = connectActionStream((action$, getProps) => [
    action$.on("SOME_ACTION", events$ => {        
        return events$.subscribe(_ => getProps().setHeight(675));
    })
])

const FutureFeed = (props) => {
    return (
        <View style={{width: 200, height: props.height}} >
            <FlatList             
                renderItem={props.renderItem}
                keyExtractor={(item) => item.id}
                data={props.items}
            />
        </View>
    )
}
    

export default compose(
    withState("height", "setHeight", 0),
    withRenderTimelineItem,
    withActionStream,
    withFutureItems,
)(FutureFeed)