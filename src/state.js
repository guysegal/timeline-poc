import uuid from 'react-native-uuid';

  const _createItems = (startIndex, count, color) => {
      const t = new Date();
      const items = [];
      for (let i=startIndex; i < startIndex + count; i++) {
          items.push({id: i, color})
      }
      return items;
  }

const initialState = {
    items: _createItems(0, 500, "black"),
    futureLength: 0
}
export const timelineReducer = (state = initialState, action) => {
    if (action.type === "ADD_FUTURE_ITEMS") {
        return {
            ...state, 
            items: [...state.items, ...action.payload],
            futureLength: action.payload.length
        }
    }      
    return state;

}

export function showFutureSection(count) {
  return function (dispatch) {
      return Promise.resolve().then(() => {
          dispatch({type: "ADD_FUTURE_ITEMS", payload: _createItems(100, count, "red")})
          dispatch({type: "SHOW_FUTURE"})
      }); 
  };
}