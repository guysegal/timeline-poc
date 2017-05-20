import {connect} from 'react-redux';
import {compose, mapProps} from 'recompose';

import {withItemsRenderer} from '../timelineItemsFactory';
import withFutureItems from './withFutureItems'

const withPastItems = connect(state => ({pastItems: state.pastItems}));

export default compose(
    withItemsRenderer,
    withPastItems,
    withFutureItems, 
    mapProps(props => ({
        ...props,
        items: [...props.pastItems, ...props.futureItems]

    }))   
)