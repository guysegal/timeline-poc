import {compose, mapProps} from 'recompose';

//import InvertedList from './InvertedListView';
import InvertedList from './InvertedFlatList';

import withTimelineItems from '../hoc/withTimelineItems'
import {onlyPastItemsVisible, onlyFutureItemsVisible} from '../hoc/notifyWhenOnlyItemTypeIsVisible'

export default compose(
    withTimelineItems,
    onlyPastItemsVisible,
    onlyFutureItemsVisible,
)(InvertedList)