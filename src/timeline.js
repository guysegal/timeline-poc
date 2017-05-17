import React from 'react';
import {View, ListView} from 'react-native';
import {compose, lifecycle, withProps, mapProps} from 'recompose';
import {connect} from 'react-redux';

import InvertedList from './InvertedList';
import {withRenderTimelineItem} from './timelineItemsFactory';

import withFutureItems from './hoc/withFutureItems'
import withScrollToStopPosition from './hoc/withScrollToStopPosition'
import onInvertedListEndReached from './hoc/onInvertedListEndReached'
import scrollToStopPositionButtonPressed from './hoc/scrollToStopPositionButtonPressed'

const withRefs = withProps({ refs: {} });
const withPastItems = connect(state => ({pastItems: state.pastItems}));

const enhance = compose(
    withRefs,
    withProps({listViewRefName: "TimelineItemsViewer_ListView"}),
    
    withRenderTimelineItem,        
    withPastItems,
    withFutureItems, 
    
    mapProps(props => ({
        ...props,
        items: [...props.pastItems, ...props.futureItems]

    })),

    mapProps(props => {
        const FUTURE_CARD_SIZE = 70;   
        console.log("eeee", props)     
        return {
            ...props,
            scrollStopPosition: props.futureLength * FUTURE_CARD_SIZE - (FUTURE_CARD_SIZE / 2) - 55,
            initialListSize: props.futureLength + 10
        }
    }),
    
    //withScrollToStopPosition,
    scrollToStopPositionButtonPressed,
    onInvertedListEndReached
)

export default enhance(InvertedList)