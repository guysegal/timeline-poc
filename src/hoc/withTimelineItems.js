import {connect} from 'react-redux';
import {compose, mapProps, lifecycle} from 'recompose';
import uuid from 'react-native-uuid';

import {withItemsRenderer} from '../timelineItems/timelineItemsRenderer';
import withFutureItems from './withFutureItems'

import createItems from '../utils'

const withPastItems = compose(
    connect(state => ({pastItems: state.pastItems})),
    lifecycle({
        componentDidMount() {
            this.props.dispatch({type: "ADD_PAST_ITEMS", payload: [
                ...createItems(100, "past"),
                {id: uuid.v4(), type: "omnibox"}]
            });
        }
    })
)

export default compose(
    withItemsRenderer,
    withPastItems,
    withFutureItems, 
    mapProps(props => ({
        ...props,
        items: [...props.pastItems, ...props.futureItems]

    }))   
)