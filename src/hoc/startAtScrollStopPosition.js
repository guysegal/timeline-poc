import {lifecycle} from 'recompose';

export default lifecycle({
    componentDidMount() {
        setTimeout(() => {this.props.scrollToStopPosition()}, 1)
    }
})
