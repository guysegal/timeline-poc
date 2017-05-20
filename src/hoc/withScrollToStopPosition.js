import React from 'react';
import {Subject, Observable} from 'rx';

export default (Component) => class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customStopPointEnabled: true,
        }
    }

    componentDidMount() {       
        this.onScroll$ = new Subject();    
        this.onScrollBeginDrag$ = new Subject();
        this.onScrollEndDrag$ = new Subject();

        const direction$ = Observable.zip(this.onScrollBeginDrag$, this.onScrollEndDrag$, (beginDrag, endDrag) => {
            if (beginDrag.contentOffset.y > endDrag.contentOffset.y) return "down";
            if (beginDrag.contentOffset.y < endDrag.contentOffset.y) return "up"         
            return "none";            
        })
            
        const relativePosition= this.onScroll$
            .map(e => e.contentOffset.y - this.props.scrollStopPosition > 0  ? "above": "below")

        const distance$= this.onScroll$
            .map(event => Math.abs(event.contentOffset.y - this.props.scrollStopPosition));

        Observable.combineLatest(direction$, relativePosition, distance$, (direction, relation, distance) => {
            if (distance < 20) return false;
            if (direction  === "up" && relation === "above") return false;
            if (direction  === "down" && relation === "below") return false;
            return true;     
        })
        .subscribe(customStopPointEnabled => this.setState({customStopPointEnabled}));

        relativePosition.distinctUntilChanged()
            .filter(_ => this.state.customStopPointEnabled)
            .subscribe(x => {
                this.props.scrollToStopPosition(true)
            })                           
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