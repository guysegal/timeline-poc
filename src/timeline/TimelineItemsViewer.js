import {compose, mapProps, lifecycle} from 'recompose';

import InvertedList from './InvertedListView';
//import InvertedList from './InvertedFlatList';

import withTimelineItems from '../hoc/withTimelineItems'
import {onlyPastItemsVisible, onlyFutureItemsVisible} from '../hoc/notifyWhenOnlyItemTypeIsVisible'

export default compose(
    lifecycle({
        componentWillMount() {
            this.x = new Date();
        },
        componentDidMount() {
            console.warn(new Date() - this.x);
        }
    }),
    withTimelineItems,
    //onlyPastItemsVisible,
    //onlyFutureItemsVisible,
)(InvertedList)