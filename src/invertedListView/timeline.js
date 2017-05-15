import React from 'react';
import {ListView} from 'react-native';
import {compose, lifecycle, mapProps} from 'recompose';
import uuid from 'react-native-uuid';
import throttle from 'lodash.throttle';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

import {withItemRenderFactory} from '../timelineItemsFactory';

// const enhance = compose(
//     withState("shouleShowFuture", "setShouleShowFuture", 0),
//     lifecycle({

//     })
// )

// const withPastItems = mapProps(props => ({

// }));

class Timeline extends React.Component {
     _ref = null;

    constructor(props) {
        super(props);
        console.log(props.items)

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
            //this._scrollListToBottomThrottled();
        }
    }

    render() {
        return (
            <ListView dataSource={this.state.dataSource}
                                    onScroll={e => console.log(e.nativeEvent)}
                                    renderScrollComponent={this._renderScrollComponent.bind(this)}
                                    renderRow={(item) => this.props.renderTimelineItem({item})}
                                    ref='itemsList'
                                    pageSize={50}
                                    scrollRenderAheadDistance={1500}
                                    initialListSize={50} />)

    }
}

export default compose(
    withItemRenderFactory,
)(Timeline)