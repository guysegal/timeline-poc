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
        _experimentalStopScrollLogic();
    }

    _experimentalStopScrollLogic() {        
        this.scrollEvents = new Subject();
        const scrollVelocity$= this.scrollEvents
            .pairwise()
            .map(scrollEventsPair => {
                const y1 = scrollEventsPair[0].y;
                const t1 = scrollEventsPair[0].t;
                const y2 = scrollEventsPair[1].y;
                const t2 = scrollEventsPair[1].t;
                return (Math.abs((y2 - y1)) / (t2 - t1)) * 100
            })

        const distanceFromScrollStopPosition$= this.scrollEvents
            .map(scrollEvent => Math.abs(scrollEvent.y - this.props.scrollStopPosition))

        Observable.combineLatest(scrollVelocity$, distanceFromScrollStopPosition$, (scrollVelocity, distanceFromScrollStopPosition) => {
            return false;
        })
        .subscribe(shouldScrollToStopPosition => {
            if (!shouldScrollToStopPosition) return;
            this.props.refs[this.props.listViewRefName].scrollTo({y: this.props.scrollStopPosition, animated: false})
        });
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