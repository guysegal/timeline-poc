/* @flow */

import {Subject} from 'rx';
import connectActionStream from './connectActionStream';
import ActionStreamProvider from './ActionStreamProvider';

const actionStream = (...epicCreators : Array<EpicCreator>) => {
  const subject = new Subject();

  let store = null

  const on = (types: string | string[], epic: Epic) => {
    if (!store) {
      throw "Subscription to actionStream is not allowed before the middleware was applied to a store";
    }

    return epic(
      subject.filter(action =>
        types.constructor === Array ?
          types.includes(action.type) :
          types === action.type)
      , store);
  };


  const middleware = storeApi => next =>  {
      store = storeApi;
      epicCreators.forEach(epicCreator => epicCreator({on}));

      return action => {
        const returnValue = next(action);
        subject.onNext(action);
        return returnValue;
      };
  };

  return {
    on, middleware
  };
};

type Epic = (observable: any, storeApi: any) => any
type EpicCreator = (actionStreamApi: any) => any

export default actionStream();

export { connectActionStream, ActionStreamProvider };
