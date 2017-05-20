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
        .subscribe(c => this.props.dispatch({type: "SCROLL_BOTTOM_REACHED"}));         
    }
    
    render() {
        const p = this.props;
        
        const onScroll = (e) => {
            if (p.onScroll) p.onScroll(e);
            this.onScroll$.onNext(e.nativeEvent);
        }
        const onScrollBeginDrag = (e) => {
            if (p.onScrollBeginDrag) p.onScrollBeginDrag(e);
            this.onScrollBeginDrag$.onNext(e.nativeEvent);
        }
        const onScrollEndDrag = (e) => {
            if (p.onScrollEndDrag) p.onScrollEndDrag(e);
            this.onScrollEndDrag$.onNext(e.nativeEvent);
        }

        return (
            <Component 
                {...p} 
                onScroll={onScroll}
                onScrollBeginDrag={onScrollBeginDrag}
                onScrollEndDrag={onScrollEndDrag}
            />     
        )
        
    }
}