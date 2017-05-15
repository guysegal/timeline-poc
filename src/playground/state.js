import uuid from 'react-native-uuid';

const initialState = {
    shouldShowFuture: false,
    items: []
}
export const timelineReducer = (state = initialState, action) => {
    if (action.type === "SHOW_FUTURE") {
        return {...state, shouldShowFuture: true}
    }
    if (action.type === "HIDE_FUTURE") {
        return {...state, shouldShowFuture: false}
    }
    if (action.type === "ADD_FUTURE_ITEMS") {
        return {...state, items: [...state.items, ...action.payload]}
    }      
    return state;

}

export function showFutureSection(forPerson) {
  return function (dispatch) {
      return Promise.resolve().then(() => {
          dispatch({type: "ADD_FUTURE_ITEMS", payload: [{id: uuid.v4(), color: "red"}]})
          dispatch({type: "SHOW_FUTURE"})
      }); 
  };
}