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

    scrollToStopPositionOnSomeAction,
    
)

export default enhance(InvertedList)