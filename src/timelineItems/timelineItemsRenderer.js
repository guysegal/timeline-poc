import React from 'react';
import {View, Text, Image} from 'react-native';
import Omnibox from './Omnibox';
import FutureFeedItem from './FutureFeedItem';

const renderTimelineItem = ({item}) => {    
    if (item.type === "omnibox") {
        return <Omnibox />
    }

    return (
        <View style={{width: 200, height: 50, backgroundColor: item.color, margin: 10}} >
            <Image style={{width: 10, height: 10}} source={{uri: item.imageUrl}}/>
            <Text style={{color: "white"}}>{item.id}</Text>            
        </View>
    )
};

export const withItemsRenderer = (Component) => props =>
    <Component {...props} renderItem={renderTimelineItem} />;