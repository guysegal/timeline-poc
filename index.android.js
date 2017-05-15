import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import uuid from 'react-native-uuid';

///////// State
import {Provider} from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

function reducer(state = {}, action) {
  switch (action.type) {

    default:
      return state
  }
}

const store = createStore(reducer, applyMiddleware(thunk));

import {setObservableConfig} from 'recompose';
import rxjsconfig from 'recompose/rxjsObservableConfig'
setObservableConfig(rxjsconfig)

//import Timeline from './src/flatList/timeline.js';
import Timeline from './src/invertedListView/timeline.js';

export default class TimelinePOC extends Component {
  state = {
    ready: false
  }

  _createItems(count) {
      const t = new Date();
      const items = [];
      for (let i=0; i < count; i++) {
          items.push({id: uuid.v4(), color: "aqua"})

      }

      const moreItems = [
          {type: "omnibox", id: uuid.v4()},
          {id: uuid.v4(), color: "red"},        
          {id: uuid.v4(), color: "red"},        
          {id: uuid.v4(), color: "red"},        
          {id: uuid.v4(), color: "red"},        
          {id: uuid.v4(), color: "red"},        
          {id: uuid.v4(), color: "red"},        
          {id: uuid.v4(), color: "red"},        
          {id: uuid.v4(), color: "red"},        
          {id: uuid.v4(), color: "red"}
      ]

      const itemsRes = items.concat(moreItems);
      this.setState({items: itemsRes, ready: true})    
  }
  
  componentWillMount() {
    setTimeout(() => this._createItems(100000), 5);
  }
  
  render() {
    if (!this.state.ready) {
      return <View style={{width: 200, height: 500, backgroundColor: "red"}} />
    }
    return (
      <Provider store={store}>
        <Timeline items={this.state.items} />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('TimelinePOC', () => TimelinePOC);