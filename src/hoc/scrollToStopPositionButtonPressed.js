import {connectActionStream} from 'redux-action-stream';

export default connectActionStream((action$, getProps) => [
    action$.on("BUTTON_PRESSED", buttonPressedEvents$ => {
        return buttonPressedEvents$.subscribe(event => {
            getProps().scrollStopPosition();
        });
    })
])