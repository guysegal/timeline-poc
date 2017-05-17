import React from 'react';
import {ListView} from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import {Subject, Observable} from 'rx';

export default class InvertedList extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const rowIds = props.items.map((row, index) => index).reverse();
        
        this.state = {
          dataSource: this.ds.cloneWithRows(props.items, rowIds)
        };
    } 

    componentDidMount() {
        
    }

    _experimentalStopScrollLogic() {        
        this.scrollEvents = new Subject();

        const velocity$= this.scrollEvents
            .pairwise()
            .map(scrollEventsPair => {
                const y1 = scrollEventsPair[0].y;
                const t1 = scrollEventsPair[0].t;
                const y2 = scrollEventsPair[1].y;
                const t2 = scrollEventsPair[1].t;
                return (Math.abs((y2 - y1)) / (t2 - t1)); //px/ms
            })

        const distance$= this.scrollEvents
            .map(scrollEvent => Math.abs(scrollEvent.y - this.props.scrollStopPosition))       

        const relation$= this.scrollEvents
            .map(scrollEvent => {
                return scrollEvent.y - this.props.scrollStopPosition > 0 ? "above": "below";
            })
            .distinctUntilChanged()

        const direction$= this.scrollEvents
            .pairwise()
            .map(scrollEventsPair => {
                const delta = scrollEventsPair[1].y - scrollEventsPair[0].y;
                return delta > 0 ? "up": "down";
            })
            .distinctUntilChanged()            

        Observable.combineLatest(velocity$, distance$, relation$, direction$, (velocity, distance, relation, direction) =>{
            console.log(velocity, distance, relation, direction)
            if (velocity > 5 && distance < 300) {
                if (direction === "up" && relation === "below") {
                    return true;
                }
                if (direction == "down" && relation === "above") {
                    return true;
                }
            }
            return false;            
        })
        .filter(x => x === true)
        .subscribe(() => this.props.refs[this.props.listViewRefName].scrollTo({y: this.props.scrollStopPosition, animated: true}))           
    }

    _renderScrollComponent(props) {
        return <InvertibleScrollView {...props} inverted={true}  />;
    }

    componentWillReceiveProps(nextProps) {  
        if (this.props.items != nextProps.items) {
            const rowIds = nextProps.items.map((row, index) => index).reverse();
            this.setState({dataSource: this.ds.cloneWithRows(nextProps.items, rowIds)});
        }    
    }

    render() {
        return (
            <ListView    
                onScrollBeginDrag={() => this.setState({isDragging: true})}  
                onScrollEndDrag={() => this.setState({isDragging: false})}               
                onScroll={(event) => this.scrollEvents.onNext({t: new Date().getTime(), y: event.nativeEvent.contentOffset.y})}
                dataSource={this.state.dataSource}
                enableEmptySections
                renderScrollComponent={this._renderScrollComponent.bind(this)}
                renderRow={(item) => this.props.renderItem({item})}
                ref={r => this.props.refs[this.props.listViewRefName] = r}
                scrollRenderAheadDistance={1500}
                initialListSize={this.props.initialListSize} />)
    }
}