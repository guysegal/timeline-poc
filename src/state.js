import uuid from 'react-native-uuid';

const _createItems = (startIndex, count, color) => {
    const t = new Date();
    const items = [];
    for (let i=startIndex; i < startIndex + count; i++) {
        items.push({id: uuid.v4(), color})
    }
    return items;
}

const initialState = {
    pastItems: [
        ..._createItems(0, 200, "black"), 
        {id: uuid.v4(), type: "omnibox"}, 
        //{id: uuid.v4(), type: "futureFeedItem"}
    ],
    futureItems: [],    
    futureLength: 0
}
export const timelineReducer = (state = initialState, action) => {
    if (action.type === "ADD_FUTURE_ITEMS") {
        return {
            ...state, 
            futureItems: [...state.futureItems, ...action.payload],            
            futureLength: action.payload.length
        }
    }      
    return state;

}

