import React from 'react';
import {View} from 'react-native';

import BackToPresentButton from './BackToPresentButton.js';
import {UpperDockedOmnibox, LowerDockedOmnibox} from '../timelineItems/Omnibox';
import TimelineItemsViewer from './TimelineItemsViewer';
import FutureFeed from './FutureFeed';

export default () =>
<View style={{flex: 1}}>
    <View style={{flex: 1, flexDirection: "column"}}>
        {/*<BackToPresentButton />        */}
        <UpperDockedOmnibox />
        <TimelineItemsViewer />
    </View>
        <LowerDockedOmnibox />
</View>