import React from 'react';
import {Subject, Observable} from 'rx';

export default (Component) => class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customStopPointEnabled: true,
        }
    }

    componentWillUpdate(nextProps){
        }

    componentDidMount() {       
        this.onScroll$ = new Subject();    
        this.onScrollBeginDrag$ = new Subject();
        this.onScrollEndDrag$ = new Subject();
        this.onMomentumScrollBegin$ = new Subject();
        this.onMomentumScrollEnd$ = new Subject();

        const direction$ = Observable.zip(this.onScrollBeginDrag$, this.onScrollEndDrag$, (beginDrag, endDrag) => {
            if (beginDrag.contentOffset.y > endDrag.contentOffset.y) return "down";
            if (beginDrag.contentOffset.y < endDrag.contentOffset.y) return "up"         
            return "none";            
        })    
        const relation$= this.onScroll$
            .map(e => e.contentOffset.y - this.props.scrollStopPosition > 0  ? "above": "below")

        const distance$= this.onScroll$
            .map(event => Math.abs(event.contentOffset.y - this.props.scrollStopPosition));

        Observable.combineLatest(direction$, relation$, distance$, (direction, relation, distance) => {
            if (distance < 20) return false;
            if (direction  === "up" && relation === "above") return false;
            if (direction  === "down" && relation === "below") return false;
            return true;     
        })
        .subscribe(customStopPointEnabled => this.setState({customStopPointEnabled}));

        relation$.distinctUntilChanged()
            .filter(_ => this.state.customStopPointEnabled)
            .subscribe(x => {
                console.log("bla", this.props.scrollStopPosition)
                this.props.refs[this.props.listViewRefName].scrollTo({y: this.props.scrollStopPosition, animated: true})            
            })                           
    }
    
    render() {
        const p = this.props;
        return (
            <Component 
                {...p} 
                onScroll={(e) => this.onScroll$.onNext(e.nativeEvent)}                                
                onScrollBeginDrag={e => this.onScrollBeginDrag$.onNext(e.nativeEvent)}
                onScrollEndDrag={e => this.onScrollEndDrag$.onNext(e.nativeEvent)}
                onMomentumScrollBegin={e => this.onMomentumScrollBegin$.onNext(e.nativeEvent)}
                onMomentumScrollEnd={e => this.onMomentumScrollEnd$.onNext(e.nativeEvent)}   
            />     
        )
        
    }
}