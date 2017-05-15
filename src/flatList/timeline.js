import React from 'react';
import {FlatList} from 'react-native';
import {compose, mapProps} from 'recompose';
import uuid from 'react-native-uuid';

import {withItemRenderFactory} from '../timelineItemsFactory';

class Timeline extends React.PureComponent {
  _ref = null;

  componentDidMount() {
      setTimeout(() => _ref.scrollToEnd({animated: false}), 15);
  }

  render() {
    return (
        <FlatList
            //onEndReached={() => console.warn("end!!")}
            //onViewableItemsChanged={x => console.log(x)}
            //initialNumToRender={50}
            ref={ref => _ref = ref}
            renderItem={this.props.renderTimelineItem}
            keyExtractor={(item) => item.id}
            data={this.props.items}
        />)
  }
}

export default compose(
    withItemRenderFactory
)(Timeline)