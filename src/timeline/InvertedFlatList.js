import React from 'react';
import {View, FlatList} from 'react-native';
import {compose} from 'recompose';

import withCustomScrollStopPosition from '../hoc/withCustomScrollStopPosition'
import startAtScrollStopPosition from '../hoc/startAtScrollStopPosition'
import stopScrollingAtStopPosition from '../hoc/stopScrollingAtStopPosition'
import notifyOnScrollBottom from '../hoc/notifyOnScrollBottom'
import listenToScrollRequests from '../hoc/listenToScrollRequests'

class InvertedFlatList extends React.PureComponent {
    state = {
        items: []
    }

    componentWillMount() {
        this.setState({items: this.props.items});
    }
    
    componentWillReceiveProps(nextProps) {  
        if (this.props.items != nextProps.items) {
            const items = nextProps.items.reverse();
            this.setState({items});
        }
    }

    render() {
        return (
            <FlatList style={{transform: [{scaleY: -1}]}}
                ref={r => this.props.refs[this.props.scrollRefName] = r}             
                keyExtractor={(item) => item.id}
                data={this.props.items}
                renderItem={({item}) => {
                    const render = this.props.renderItem({item});
                    return <View style={{transform: [{scaleY: -1}]}} >{render}</View>
                }}
                initialNumToRender={this.props.initialListSize}                

                onScrollBeginDrag={this.props.onScrollBeginDrag}
                onScrollEndDrag={this.props.onScrollEndDrag}
                onScroll={this.props.onScroll}

                onViewableItemsChanged={this.props.onViewableItemsChanged}                 
            />)
    }
}

export default compose(
    withCustomScrollStopPosition,    
    startAtScrollStopPosition,    
    stopScrollingAtStopPosition,
    //notifyOnScrollBottom,
    listenToScrollRequests
)(InvertedFlatList);