import React from 'react';
import {View, ListView} from 'react-native';
import {compose, lifecycle, withProps} from 'recompose';
import {connect} from 'react-redux';
import {connectActionStream} from 'redux-action-stream';

import InvertedList from './InvertedList';
import {withRenderTimelineItem} from './timelineItemsFactory';
import {showFutureSection} from './state';

const withRefs = withProps({ refs: {} });

const withScrollToStopPosition = (Component) => props => {
    const BUTTON_SIZE = 55;
    const FUTURE_CARD_SIZE = 70;
    return <Component 
        {...props} 
        scrollStopPosition={props.futureLength * FUTURE_CARD_SIZE - (FUTURE_CARD_SIZE / 2) - BUTTON_SIZE}
        initialListSize={props.futureLength + 10} 
    />
}

const scrollToStopPositionOnSomeAction = connectActionStream((action$, getProps) => [
    action$.on("BUTTON_PRESSED", buttonPressed$ => {
        return buttonPressed$.subscribe(event => {
            const props = getProps();
            const scrollTo = props.refs[props.listViewRefName].scrollTo;
            scrollTo({y: props.scrollStopPosition, animated: false})
        });
    })
])

const withPastItems = connect(state => ({items: state.items}));

const withFutureItems = compose(
    connect(state => ({       
        futureLength: state.futureLength
    })),
    lifecycle({
        componentDidMount() {
            this.props.dispatch(showFutureSection(200));
        }
    })
)

const enhance = compose(
    withRefs,
    withProps({listViewRefName: "TimelineItemsViewer_ListView"}),

    withRenderTimelineItem,        
    withPastItems,
    withFutureItems,    
    
    withScrollToStopPosition,
    scrollToStopPositionOnSomeAction    
)

export default enhance(InvertedList)