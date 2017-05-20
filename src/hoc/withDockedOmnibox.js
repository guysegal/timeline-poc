import React from 'react';
import {compose} from 'recompose';
import {Subject, Observable} from 'rx';

export default (Component) => class extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {  
        this.onChangeVisibleRows$ = new Subject(); 

        const onlyFutureItemsAreShown$ =  this.onChangeVisibleRows$
            .map(visibleRows => {
                const visibleRowIds = Object.keys(visibleRows);
                for (let i=0; i < visibleRowIds.length; i++) {
                    if (this.props.items[visibleRowIds[i]].color != "red") {
                        return false;
                    }
                }
                return true;
            })
            .distinctUntilChanged()  

        onlyFutureItemsAreShown$.skip(1).subscribe(onlyFutureItemsAreShown => {
            if (onlyFutureItemsAreShown) {
                this.props.dispatch({type: "SET_UPPER_DOCKER_OMNIBOX_VISIBILITY", payload: true});
            }
            else {
                this.props.dispatch({type: "SET_UPPER_DOCKER_OMNIBOX_VISIBILITY", payload: false});                
                
            }
        })
    }
    
    render() {
        const p = this.props;
        
        const onChangeVisibleRows = (visibleRows, _) => {
            if (p.onChangeVisibleRows) p.onChangeVisibleRows(visibleRows, _);
            this.onChangeVisibleRows$.onNext(visibleRows.s1);
        }

        return (
            <Component 
                {...p} 
                onChangeVisibleRows={onChangeVisibleRows}
            />     
        )
        
    }
}