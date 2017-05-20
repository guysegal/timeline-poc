import {compose} from 'recompose';

//import InvertedList from './InvertedListView';
import InvertedList from './InvertedFlatList';

import withTimelineItems from '../hoc/withTimelineItems'
import notifyWhenOnlyFutureItemsAreVisible from '../hoc/notifyWhenOnlyFutureItemsAreVisible'

export default compose(
    withTimelineItems, 
    notifyWhenOnlyFutureItemsAreVisible,
)(InvertedList)