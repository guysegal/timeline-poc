import {connectActionStream} from 'modules/redux-action-stream';

export default connectActionStream((action$, getProps) => [
    action$.on("SCROLL_TO_STOP_POSITION", actionStrem$ => {
        return actionStrem$.subscribe(event => {
            getProps().scrollToStopPosition();
        });
    })
])