import React from 'react';
import {compose, withState} from 'recompose';
import {Subject, Observable} from 'rx';

const listenToScrollDirection = (Component) => class extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {  
        this.onScrollBeginDrag$ = new Subject();
        this.onScrollEndDrag$ = new Subject();

        const direction$ = Observable.zip(this.onScrollBeginDrag$, this.onScrollEndDrag$, (beginDrag, endDrag) => {
            if (beginDrag.contentOffset.y > endDrag.contentOffset.y) return "down";
            if (beginDrag.contentOffset.y < endDrag.contentOffset.y) return "up"         
            return "none";            
        })

        direction$.distinctUntilChanged().subscribe(d => this.props.setScrollDirection(d))
    }
    
    render() {
        const p = this.props;
        
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
                onScrollBeginDrag={onScrollBeginDrag}
                onScrollEndDrag={onScrollEndDrag}
            />     
        )
    }
}

export default compose(
    withState("scrollDirection", "setScrollDirection", "none"),
    listenToScrollDirection
)