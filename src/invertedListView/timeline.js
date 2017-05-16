import React from 'react';
import {View, ListView} from 'react-native';
import {connect} from 'react-redux';
import {compose, lifecycle, mapProps, mapPropsStream, withProps} from 'recompose';
import uuid from 'react-native-uuid';
import throttle from 'lodash.throttle';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

import {withRenderTimelineItem} from '../timelineItemsFactory';
import {showFutureSection} from '../state';
import {connectActionStream} from 'redux-action-stream';

const withRefs = withProps({ refs: {} });

const withScrollToStopPosition = (Component) => props => {
    const VIEWPORT = 675
    const FUTURE_CARD_SIZE = 70
    return <Component 
        {...props} 
        scrollStopPosition={props.futureLength * FUTURE_CARD_SIZE - FUTURE_CARD_SIZE / 2}
        initialListSize={props.futureLength + 10} 
    />
}

const scrollToStopPositionOnSomeAction = connectActionStream(action$ => [
    action$.on("SOME_ACTION", someAction$ => {
        return someAction$.subscribe(action => {
            const {scrollTo, scrollStopPosition} = action.payload;
            scrollTo({y: scrollStopPosition, animated: false})
        });
    })
])

const withPastItems = connect(state => ({items: state.items}));

const withFutureItems = compose(
    connect(state => ({       
        futureLength: state.futureLength || 5      
    })),
    lifecycle({
        componentDidMount() {
            this.props.dispatch(showFutureSection(50));
        }
    })
)

class InvertedList extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const rowIds = props.items.map((row, index) => index).reverse();

        this.state = {
          dataSource: this.ds.cloneWithRows(props.items, rowIds)
        };
    } 

    _renderScrollComponent(props) {
        return <InvertibleScrollView {...props} inverted={true}  />;
    }

    componentWillReceiveProps(nextProps) {  
        if (this.props.items != nextProps.items) {
            const rowIds = nextProps.items.map((row, index) => index).reverse();
            this.setState({dataSource: this.ds.cloneWithRows(nextProps.items, rowIds)});
        }    
    }

    render() {
        return (
            <ListView 
                dataSource={this.state.dataSource}
                enableEmptySections
                renderScrollComponent={this._renderScrollComponent.bind(this)}
                renderRow={(item) => this.props.renderItem({item})}
                ref={r => this.props.refs[this.props.listViewRefName] = r}
                scrollRenderAheadDistance={1500}
                initialListSize={this.props.initialListSize} />)
    }
}

const enhance = compose(
    withRefs,
    withProps({listViewRefName: "TimelineItemsViewer_ListView"}),

    withRenderTimelineItem,
        
    withPastItems,
    withFutureItems,
    
    withScrollToStopPosition,

    //just for example, the dispatch itself is from the button component
    lifecycle({
        componentDidMount(nextProps, nextState) {
            setTimeout(() => this.props.dispatch({
                type: "SOME_ACTION", 
                payload: {
                    scrollStopPosition: this.props.scrollStopPosition || 0,
                    scrollTo: this.props.refs[this.props.listViewRefName].scrollTo
                }
            }), 1)                                   
        }
    }),

    scrollToStopPositionOnSomeAction,
    
)

export default enhance(InvertedList)