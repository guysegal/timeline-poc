import React from 'react';
import {View, ListView} from 'react-native';
import {compose, lifecycle, withProps, mapProps} from 'recompose';
import {connect} from 'react-redux';

import InvertedList from './InvertedList';
import {withItemsRenderer} from './timelineItemsFactory';

import withFutureItems from './hoc/withFutureItems'
import withScrollToStopPosition from './hoc/withScrollToStopPosition'
import dispatchOnScrollBottom from './hoc/dispatchOnScrollBottom'
import scrollToStopPositionButtonPressed from './hoc/scrollToStopPositionButtonPressed'

const withRefs = withProps({ refs: {} });
const withPastItems = connect(state => ({pastItems: state.pastItems}));
const startAtScrollStopPosition = lifecycle({
    componentDidMount() {
        setTimeout(() => {this.props.scrollToStopPosition();}, 1)
    }
})

const withItems = compose(
    withPastItems,
    withFutureItems, 
    mapProps(props => ({
        ...props,
        items: [...props.pastItems, ...props.futureItems]

    }))   
)

const withCustomScrollStopPosition = (scrollRefName) => compose(
    withRefs,
    withProps({scrollRefName}), 
    mapProps(props => {
        const FUTURE_CARD_SIZE = 70;   
        const y = props.futureItems.length * FUTURE_CARD_SIZE - (FUTURE_CARD_SIZE / 2) - 55;
        return {
            ...props,
            scrollStopPosition: y,
            scrollToStopPosition: (animated = false) => props.refs[props.scrollRefName].scrollTo({y, animated}),
            initialListSize: props.futureItems.length + 10
        }
    }),
)

const enhance = compose(   
    withItems, 
    withItemsRenderer,    
    
    withCustomScrollStopPosition("TimelineItemsViewer_ListView"),    
    startAtScrollStopPosition,    
    withScrollToStopPosition,
    dispatchOnScrollBottom,
    scrollToStopPositionButtonPressed    
)

export default enhance(InvertedList)