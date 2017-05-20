const initialState = {
    pastItems: [],        
    futureItems: [],    
}

export const timelineReducer = (state = initialState, action) => {
    if (action.type === "ADD_PAST_ITEMS") {
        console.log(action)
        return {
            ...state, 
            pastItems: [...state.pastItems, ...action.payload]
        }
    }
    if (action.type === "ADD_FUTURE_ITEMS") {
        return {
            ...state, 
            futureItems: [...state.futureItems, ...action.payload]
        }
    }
    return state;
}

