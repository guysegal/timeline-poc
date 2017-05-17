import React, { Component } from 'react';
import uuid from 'react-native-uuid';
import {View} from 'react-native';

import {ActionStreamProvider, createActionStream, createActionStreamMiddelware} from 'redux-action-stream'
const actionStream = createActionStream()

import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {timelineReducer} from './state'
import thunk from 'redux-thunk';
const store = createStore(timelineReducer, applyMiddleware(thunk, createActionStreamMiddelware()));

import {setObservableConfig} from 'recompose';
import rxjsconfig from 'recompose/rxjsObservableConfig'
setObservableConfig(rxjsconfig)

import Timeline from './timeline.js';
import Button from './button.js';
import FutureFeed from './FutureFeed.js';

export default class TimelinePOC extends Component {
  render() {
    return (
      <Provider store={store}>
        <ActionStreamProvider actionStream={actionStream}>
          <View style={{flex: 1, flexDirection: "column"}}>
            <Button />
            <Timeline />
            <FutureFeed style={{height: 100}} />
          </View>
        </ActionStreamProvider>
      </Provider>
    );
  }
}