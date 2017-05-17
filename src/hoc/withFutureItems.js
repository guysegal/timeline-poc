import {compose, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import uuid from 'react-native-uuid';

const _createItems = (startIndex, count, color) => {
    const t = new Date();
    const items = [];
    for (let i=startIndex; i < startIndex + count; i++) {
        items.push({id: uuid.v4(), color})
    }
    return items;
}

function getFutureItems(count) {
  return function (dispatch, getState) {
      return Promise.resolve().then(() => {
          if (getState().futureItems.length > 0) {
              return getState().futureItems;
          }
          else {
              dispatch({type: "ADD_FUTURE_ITEMS", payload: _createItems(0, count, "red")})
          }
      }); 
  };
}

export default compose(
    connect(state => ({
        futureItems: state.futureItems,
        futureLength: state.futureLength
    })),
    lifecycle({
        componentDidMount() {
            this.props.dispatch(getFutureItems(50));
        }
    })
)