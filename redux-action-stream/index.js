import actionStream from './actionStream';

let _actionStreamInstance;

export const createActionStream = () => {
  _actionStreamInstance = actionStream();
  return _actionStreamInstance;
}

export const createActionStreamMiddelware = () => {
  if (!_actionStreamInstance) {
    console.warn("actionStream is not initialized, did you remember to call 'createActionStream'?")
    return null;
  }
  return _actionStreamInstance.middleware;
}

export const connectActionStream = require('./connectActionStream').default;

export const ActionStreamProvider = require('./actionStreamProvider').default;;
