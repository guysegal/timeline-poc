import React from 'react';
import {ListView} from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

export default class InvertedList extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const rowIds = props.items.map((row, index) => index).reverse();
        
        this.state = {
            dataSource: this.ds.cloneWithRows(props.items, rowIds)
        };
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
                onScrollBeginDrag={this.props.onScrollBeginDrag}
                onScrollEndDrag={this.props.onScrollEndDrag}
                onScroll={this.props.onScroll}                
                onMomentumScrollBegin={this.props.onMomentumScrollBegin}
                onMomentumScrollEnd={this.props.onMomentumScrollEnd}
                dataSource={this.state.dataSource}
                enableEmptySections
                renderScrollComponent={this._renderScrollComponent.bind(this)}
                renderRow={(item) => this.props.renderItem({item})}
                ref={r => this.props.refs[this.props.scrollRefName] = r}
                scrollRenderAheadDistance={this.props.scrollStopPosition + 500}
                initialListSize={this.props.initialListSize} />)
    }
}