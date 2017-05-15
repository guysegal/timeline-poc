import React from 'react';
import {View, ListView} from 'react-native';
import {connect} from 'react-redux';
import {compose, lifecycle, mapProps, mapPropsStream} from 'recompose';
import throttle from 'lodash.throttle';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

import {withItemRenderFactory} from '../timelineItemsFactory';
import {showFutureSection} from './state';

const enhance = compose(
    connect(state => ({
        shouldShowFuture: state.shouldShowFuture,
        items: state.items
    })),
    withItemRenderFactory,
    lifecycle({
        componentDidMount() {
            setTimeout(() => this.props.dispatch(showFutureSection()), 1000)            
        }
    })
)

class TimelineItemsViewer extends React.Component {
     _ref = null;

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const rowIds = props.items.map((row, index) => index).reverse();

        this.state = {
          dataSource: this.ds.cloneWithRows(props.items, rowIds)
        };

        this._scrollListToBottomThrottled = throttle(this._scrollListToBottom.bind(this), 300);
        
    } 

    _scrollListToBottom() {
        //List is inverted, thus scrolling to 0 is scrolling to end
        this.refs.itemsList ? this.refs.itemsList.scrollTo({y: 0}) : null;
    }     

    _renderScrollComponent(props) {
        return <InvertibleScrollView {...props} inverted={true}  />;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.items != nextProps.items) {
            const rowIds = nextProps.items.map((row, index) => index).reverse();
            this.setState({dataSource: this.ds.cloneWithRows(nextProps.items, rowIds)});
            this._scrollListToBottomThrottled();
        }
    }

    render() {
        return (
            <ListView dataSource={this.state.dataSource}
                                    enableEmptySections
                                    onScroll={e => console.log(e.nativeEvent)}
                                    renderScrollComponent={this._renderScrollComponent.bind(this)}
                                    renderRow={(item) => this.props.renderTimelineItem({item})}
                                    ref='itemsList'
                                    pageSize={50}
                                    scrollRenderAheadDistance={1500}
                                    initialListSize={50} />)

    }
}

export default enhance(TimelineItemsViewer)