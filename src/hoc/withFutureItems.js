import {compose, lifecycle} from 'recompose';
import {connect} from 'react-redux';

import createItems from '../utils'

function getFutureItems(count) {
  return function (dispatch, getState) {
      return Promise.resolve().then(() => {
          if (getState().futureItems.length > 0) {
              return getState().futureItems;
          }
          else {
              dispatch({type: "ADD_FUTURE_ITEMS", payload: createItems(count, "future")})
          }
      }); 
  };
}

export default compose(
    connect(state => ({futureItems: state.futureItems})),
    lifecycle({
        componentDidMount() {
            this.props.dispatch(getFutureItems(50));
        }
    })
)