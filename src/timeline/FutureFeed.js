import React from 'react';
import {View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {connectActionStream} from 'redux-action-stream';
import {Observable} from 'rx'
import {compose, withState} from 'recompose';

import Omnibox from '../timelineItems/Omnibox';
import withFutureItems from '../hoc/withFutureItems';
import {withItemsRenderer} from '../timelineItems/timelineItemsRenderer';

const withActionStream = connectActionStream((action$, getProps) => [
    action$.on("SCROLL_BOTTOM_REACHED", events$ => {        
        return events$.subscribe(_ => getProps().setHeight(675));
    })
])

const FutureFeed = (props) => {
    return (
        <View style={{width: 150, height: props.height}} >
            <FlatList             
                renderItem={props.renderItem}
                keyExtractor={(item) => item.id}
                data={props.futureItems}
            />
        </View>
    )
}
    

export default compose(
    withState("height", "setHeight", 0),
    withItemsRenderer,
    withActionStream,
    withFutureItems,
)(FutureFeed)