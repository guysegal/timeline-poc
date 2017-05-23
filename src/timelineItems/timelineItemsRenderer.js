import React from 'react';
import {View, Text, Image} from 'react-native';
import Omnibox from './Omnibox';
import FutureFeedItem from './FutureFeedItem';

const imageUrls = ['https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/2000px-Flag_of_the_Netherlands.svg.png', 
'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Fiji.svg/255px-Flag_of_Fiji.svg.png', 
'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png', 
'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/1280px-Flag_of_Norway.svg.png'];

const renderTimelineItem = ({item}) => {    
    if (item.type === "omnibox") {
        return <Omnibox />
    }

    var imageIndex = Math.floor(Math.random() / 0.25);

    return (
        <View style={{width: 200, height: 50, backgroundColor: item.color, margin: 10}} >
            <Image style={{width: 10, height: 10}} source={{uri: imageUrls[imageIndex]}}/>
            <Text style={{color: "white"}}>{item.id}</Text>            
        </View>
    )
};

export const withItemsRenderer = (Component) => props =>
    <Component {...props} renderItem={renderTimelineItem} />;