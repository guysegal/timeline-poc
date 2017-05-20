import React, {PureComponent} from 'react';
import {Subject} from 'rx';

export default (Component) => class extends PureComponent {
    componentDidMount() {  
        this.onViewableItemsChanged$ = new Subject(); 

        const onlyFutureItemsAreVisible$ =  this.onViewableItemsChanged$
            .map(viewableItems => {
                const itemTypes = viewableItems.map(viewableItem => viewableItem.item.type)
                if (itemTypes.filter(type => type !== "future").length ==  0) return true;
                return false;
            })
            .distinctUntilChanged()  

        onlyFutureItemsAreVisible$.skip(1).subscribe(onlyFutureItemsAreShown => {
            if (onlyFutureItemsAreShown) {
                this.props.dispatch({type: "ONLY_FUTURE_ITEMS_ARE_VISIBLE", payload: true});                
            }
            else {
                this.props.dispatch({type: "ONLY_FUTURE_ITEMS_ARE_VISIBLE", payload: false});
            }
        });
        
        // - for  ListView, works only on iOS, 
        // - doesn't work for Android becuase of a bug that won't be fixed
        // - still here as an example
        // - this was an incentive to move to FlatList (which turned out to be not so hard to implement as an inverted list)
        // - this should be removed once we are sure we are moving on with FlatList
        this.onChangeVisibleRows$ = new Subject();
        
        const onlyFutureItemsAreVisible_ListView$ =  this.onChangeVisibleRows$
            .map(visibleRows => {
                const visibleRowIds = Object.keys(visibleRows);
                for (let i=0; i < visibleRowIds.length; i++) {
                    if (this.props.items[visibleRowIds[i]].type != "future") {
                        return false;
                    }
                }
                return true;
            })
            .distinctUntilChanged()  

        onlyFutureItemsAreVisible_ListView$.skip(1).subscribe(onlyFutureItemsAreShown => {
            if (onlyFutureItemsAreShown) {
                this.props.dispatch({type: "ONLY_FUTURE_ITEMS_ARE_VISIBLE", payload: true});
            }
            else {
                this.props.dispatch({type: "ONLY_FUTURE_ITEMS_ARE_VISIBLE", payload: false});                
            }
        });
    }
    
    render() {
        const p = this.props;

        const onViewableItemsChanged = (info) => {
            if (p.onViewableItemsChanged) p.onViewableItemsChanged(info);
            this.onViewableItemsChanged$.onNext(info.viewableItems);
        }

        const onChangeVisibleRows = (visibleRows, _) => {
            if (p.onChangeVisibleRows) p.onChangeVisibleRows(visibleRows, _);
            this.onChangeVisibleRows$.onNext(visibleRows.s1);
        }        

        return (
            <Component 
                {...p} 
                onChangeVisibleRows={onChangeVisibleRows} //for ListView, works only on iOS (here as an example)
                onViewableItemsChanged={onViewableItemsChanged}
            />     
        )
        
    }
}