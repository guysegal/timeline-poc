import createItems from './utils';

const initialState = {
    pastItems: [...createItems(200, "past")],        
    futureItems: [],    
}

export const timelineReducer = (state = initialState, action) => {
    if (action.type === "ADD_FUTURE_ITEMS") {
        return {
            ...state, 
            futureItems: [...state.futureItems, ...action.payload]
        }
    }
    return state;
}

