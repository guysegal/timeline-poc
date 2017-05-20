import uuid from 'react-native-uuid';
import {compose, withProps, mapProps} from 'recompose';

const withRefs = withProps({ refs: {} });

export default compose(
    withRefs,
    withProps({scrollRefName: uuid.v4()}), 
    mapProps(props => {
        const FUTURE_CARD_SIZE = 70;   
        const y = props.futureItems.length * FUTURE_CARD_SIZE - (FUTURE_CARD_SIZE / 2) - 55;  
        
        let scrollToStopPosition = () => {}
        const ref = props.refs[props.scrollRefName];
        if (ref) {
            if (ref.scrollTo) {
                scrollToStopPosition = (animated = false) => ref.scrollTo({y, animated});
            }
            else if (ref.scrollToOffset) {
                scrollToStopPosition = (animated = false) => props.refs[props.scrollRefName].scrollToOffset({offset: y, animated});
            }
        }
        return {
            ...props,
            scrollStopPosition: y,
            scrollToStopPosition,
            initialListSize: props.futureItems.length + 10
        }
    }),
)