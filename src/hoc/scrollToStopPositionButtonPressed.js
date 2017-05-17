import {connectActionStream} from 'redux-action-stream';

export default connectActionStream((action$, getProps) => [
    action$.on("BUTTON_PRESSED", buttonPressedEvents$ => {
        return buttonPressedEvents$.subscribe(event => {
            const props = getProps();
            console.log(props)
            const scrollTo = props.refs[props.listViewRefName].scrollTo;
            console.log(props.scrollStopPosition)
            scrollTo({y: props.scrollStopPosition, animated: false})
        });
    })
])