import React from 'react';
import {View, ListView, FlatList, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {compose, lifecycle, mapProps, mapPropsStream} from 'recompose';
import uuid from 'react-native-uuid';
import throttle from 'lodash.throttle';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

import {withRenderTimelineItem} from '../timelineItemsFactory';
import {showFutureSection} from '../state';

const VIEWPORT = 675
const FUTURE_CARD_SIZE = 70

const enhance = compose(
    connect(state => ({
        items: state.items,
        futureLength: state.futureLength

    })),
    withItemRenderFactory,
    lifecycle({
        componentDidMount() {
            setTimeout(() => this.props.dispatch(showFutureSection(20)), 100)            
        }
    })
)

class TimelineItemsViewer extends React.PureComponent {
  _ref = null;

  state = {
      scrollSize: 0
  }

  componentDidMount() {
    setTimeout(() => _ref.scrollToOffset({
        animated: false, 
        offset: this.state.scrollSize - this.props.futureLength * FUTURE_CARD_SIZE  - VIEWPORT + FUTURE_CARD_SIZE/2
    }), 2000);    
  }

  render() {
    return (
        <FlatList
            onContentSizeChange={(x,y) => {
                console.log(y)
                this.setState({scrollSize: y})
            }}
            ref={ref => _ref = ref}
            renderItem={this.props.renderTimelineItem}
            keyExtractor={(item) => item.id}
            data={this.props.items}
        />)
  }
}

export default enhance(TimelineItemsViewer)