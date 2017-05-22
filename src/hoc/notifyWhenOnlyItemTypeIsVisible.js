import React, {PureComponent} from 'react';
import {Subject} from 'rx';

const onlyItemTypeVisible = (Component, itemType) => class extends PureComponent {
    componentDidMount() {  

        this.onViewableItemsChanged$ = new Subject(); 

        const onlyItemTypeIsVisible$ =  this.onViewableItemsChanged$
            .map(viewableItems => {
                const itemTypes = viewableItems.map(viewableItem => viewableItem.item.type)
                if (itemTypes.filter(type => type !== itemType).length ==  0) return true;
                return false;
            })
            .distinctUntilChanged()  

        // skip 1 ?
        onlyItemTypeIsVisible$.skip(1).subscribe(onlyItemsTypeIsVisible => {
            var actionToDispatch = "";

            if (itemType === "past")
                actionToDispatch = "ONLY_PAST_ITEMS_ARE_VISIBLE";
            else if (itemType === "future")
                actionToDispatch = "ONLY_FUTURE_ITEMS_ARE_VISIBLE";

            this.props.dispatch({type: actionToDispatch, payload: onlyItemsTypeIsVisible});                
        });
    }
    
    render() {
        const p = this.props;

        const onViewableItemsChanged = (info) => {
            if (p.onViewableItemsChanged) p.onViewableItemsChanged(info);
            this.onViewableItemsChanged$.onNext(info.viewableItems);
        }

        return (
            <Component 
                {...p} 
                onViewableItemsChanged={onViewableItemsChanged}
            />     
        )
        
    }
}

export const onlyPastItemsVisible = (Component) => {
    return onlyItemTypeVisible(Component, "past");
}

export const onlyFutureItemsVisible = (Component) => {
    return onlyItemTypeVisible(Component, "future");
}

