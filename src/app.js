import React, { Component } from 'react';
import uuid from 'react-native-uuid';

import {Provider} from 'react-redux'
import actionStream, {ActionStreamProvider} from 'redux-action-stream'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';

import {timelineReducer} from './state'
const store = createStore(timelineReducer, applyMiddleware(thunk, actionStream.middleware));

import {setObservableConfig} from 'recompose';
import rxjsconfig from 'recompose/rxjsObservableConfig'
setObservableConfig(rxjsconfig)

//import Timeline from './flatList/timeline.js';
import Timeline from './invertedListView/timeline.js';

export default class TimelinePOC extends Component {
  render() {
    return (
      <Provider store={store}>
        <ActionStreamProvider actionStream={actionStream}>
            <Timeline />
        </ActionStreamProvider>
      </Provider>
    );
  }
}