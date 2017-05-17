import React, {Component, PropTypes} from 'react'
import actionStreamShape from './actionStreamShape'

export default (...epics) => WrappedComponent => {
     class ConnectActionStream extends React.Component {
        constructor(props, context) {
            super(props, context)
            this.actionStream = context.actionStream
            this.subscriptionArrays = null
        }

        getWrappedInstance() {
            if (!this.refs) return null;
            return this.refs.wrappedInstance
        }

        componentDidMount() {
            console.log(this.props)
            const wrappedInstace = this.refs ? this.refs.wrappedInstance: {};
            this.subscriptionArrays = epics.map(f => f(this.actionStream, () => this.props, this.refs.wrappedInstance))
        }

        render() {
            //const wrappedProps = {...this.props, ref: 'wrappedInstance'}

            return (
              <WrappedComponent actionStream={this.actionStream} {...this.props} />
            )
        }

        componentWillUnmount() {
            this.subscriptionArrays.forEach(subscriptionArray =>
                subscriptionArray.forEach(subscription =>
                    subscription.dispose()))
        }
    }

    ConnectActionStream.contextTypes = {
        actionStream: actionStreamShape.isRequired
    }
    
    return ConnectActionStream
}
