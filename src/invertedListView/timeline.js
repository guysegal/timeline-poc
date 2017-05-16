import React from 'react';
import {View, ListView} from 'react-native';
import {connect} from 'react-redux';
import {compose, lifecycle, mapProps, mapPropsStream} from 'recompose';
import uuid from 'react-native-uuid';
import throttle from 'lodash.throttle';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

import {withItemRenderFactory} from '../timelineItemsFactory';
import {showFutureSection} from '../state';

const VIEWPORT = 675
const FUTURE_CARD_SIZE = 70

const enhance = compose(
    connect(state => ({
        items: state.items,
        futureLength: state.futureLength || 5      
    })),
    withItemRenderFactory,
    lifecycle({
        componentDidMount() {
            this.props.dispatch(showFutureSection(10));
        }
    })
)

class TimelineItemsViewer extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const rowIds = props.items.map((row, index) => index).reverse();

        this.state = {
          dataSource: this.ds.cloneWithRows(props.items, rowIds)
        };
    } 

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.futureLength != this.props.futureLength) {
            setTimeout(() => {
                const scrollStopPoint = this.props.futureLength * FUTURE_CARD_SIZE - FUTURE_CARD_SIZE / 2; 
                this.refs.itemsList.scrollTo({y: scrollStopPoint, animated: false})
            }, 1); 
        }
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
                renderRow={(item) => this.props.renderTimelineItem({item})}
                ref='itemsList'
                scrollRenderAheadDistance={1500}
                initialListSize={this.props.futureLength + 10} />)
    }
}

export default enhance(TimelineItemsViewer)