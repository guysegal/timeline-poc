import React from 'react';
import {ListView} from 'react-native';
import {compose} from 'recompose';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

import withCustomScrollStopPosition from '../hoc/withCustomScrollStopPosition'
import startAtScrollStopPosition from '../hoc/startAtScrollStopPosition'
import stopScrollingAtStopPosition from '../hoc/stopScrollingAtStopPosition'
import notifyOnScrollBottom from '../hoc/notifyOnScrollBottom'
import listenToScrollRequests from '../hoc/listenToScrollRequests'

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

export default compose(
    withCustomScrollStopPosition,    
    startAtScrollStopPosition,    
    stopScrollingAtStopPosition,
    notifyOnScrollBottom,
    listenToScrollRequests
)(InvertedListView);