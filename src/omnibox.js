import React from 'react';
import {View} from 'react-native';
import {mapProps} from 'recompose';
import uuid from 'react-native-uuid';
import R from 'ramda';

class Omnibox extends React.PureComponent {
    render() {
       return  <View onLayout={e => console.log(e.nativeEvent)} style={{width: 200, height: 50, backgroundColor: "green", margin: 10}} />
    }
}

export default (Omnibox);

export const withOmnibox = mapProps(props => {
    const omniboxItem = {type: "omnibox", id: uuid.v4()};
    return {...props, items: R.unionWith(R.eqBy(R.prop('id')), props.items, [omniboxItem])};
})