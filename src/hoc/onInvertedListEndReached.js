import React from 'react';
import {Subject, Observable} from 'rx';

export default (Component) => class extends React.Component {
    
    componentDidMount() {        
        this.onScroll$ = new Subject();    
        this.onScrollBeginDrag$ = new Subject();
        this.onScrollEndDrag$ = new Subject();

        const direction$ = Observable.zip(this.onScrollBeginDrag$, this.onScrollEndDrag$, (beginDrag, endDrag) => {
            if (beginDrag.contentOffset.y > endDrag.contentOffset.y) return "down";
            if (beginDrag.contentOffset.y < endDrag.contentOffset.y) return "up"         
            return "none";            
        })    

        const offset$ = this.onScroll$.map(e => e.contentOffset.y)

        Observable.combineLatest(offset$, direction$, (offset, direction) => {
            return direction == "none" || direction == "down" && offset <= 0
        })
        .filter(should => should === true)        
        .subscribe(c => console.warn("dispatch"))         
    }
    
    render() {
        const p = this.props;
        return (
            <Component 
                {...p} 
                onScroll={(e) => this.onScroll$.onNext(e.nativeEvent)}                                
                onScrollBeginDrag={e => this.onScrollBeginDrag$.onNext(e.nativeEvent)}
                onScrollEndDrag={e => this.onScrollEndDrag$.onNext(e.nativeEvent)}
            />     
        )
        
    }
}