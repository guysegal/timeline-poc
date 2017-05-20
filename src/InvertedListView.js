import React from 'react';
import {ListView} from 'react-native';
import uuid from 'react-native-uuid';
import {compose, lifecycle, withProps, mapProps, withState} from 'recompose';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

import stopScrollingAtStopPosition from './hoc/withScrollToStopPosition'
import dispatchOnScrollBottom from './hoc/dispatchOnScrollBottom'
import listenToScrollRequests from './hoc/listenToScrollRequests'

class InvertedListView extends React.Component {
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
                ref={r => this.props.refs[this.props.scrollRefName] = r}
                dataSource={this.state.dataSource}
                renderScrollComponent={this._renderScrollComponent.bind(this)}
                renderRow={(item) => this.props.renderItem({item})}
                enableEmptySections
                scrollRenderAheadDistance={this.props.scrollStopPosition + 500}
                initialListSize={this.props.initialListSize}              

                onScrollBeginDrag={this.props.onScrollBeginDrag}
                onScrollEndDrag={this.props.onScrollEndDrag}
                onScroll={this.props.onScroll}                
                onMomentumScrollBegin={this.props.onMomentumScrollBegin}
                onMomentumScrollEnd={this.props.onMomentumScrollEnd}
                
                onChangeVisibleRows={this.props.onChangeVisibleRows}                
            />)
    }
}

const withRefs = withProps({ refs: {} });
const startAtScrollStopPosition = lifecycle({
    componentDidMount() {
        setTimeout(() => {this.props.scrollToStopPosition();}, 1)
    }
})

const withCustomScrollStopPosition = compose(
    withRefs,
    withProps({scrollRefName: uuid.v4()}), 
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


export default compose(
    withCustomScrollStopPosition,    
    startAtScrollStopPosition,    
    stopScrollingAtStopPosition,
    dispatchOnScrollBottom,
    listenToScrollRequests
)(InvertedListView);