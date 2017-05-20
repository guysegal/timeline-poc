import React from 'react';
import {View} from 'react-native';
import {compose} from 'recompose';

import InvertedListView from './InvertedListView';
//import InvertedFlatList from './InvertedFlatList';

import withTimelineItems from './hoc/withTimelineItems'
import {UpperDockedOmnibox} from './omnibox'
import withDockedOmnibox from './hoc/withDockedOmnibox'

const Timeline = compose(withTimelineItems, withDockedOmnibox)(InvertedListView)

export default () =>
    <View style={{flex: 1}}>
        <UpperDockedOmnibox />
        <Timeline />
    </View>