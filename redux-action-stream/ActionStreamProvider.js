import React, {Component, Children, PropTypes} from 'react'
import actionStreamShape from './actionStreamShape'

export default class ActionStreamProvider extends Component {
  getChildContext() {
    return { actionStream: this.actionStream }
  }

  constructor(props, context) {
    super(props, context)

    this.actionStream = props.actionStream
  }

  render() {
    const { children } = this.props
    return Children.only(children)
  }
}

ActionStreamProvider.propTypes = {
  actionStream: actionStreamShape.isRequired,
  children: PropTypes.element.isRequired
}
ActionStreamProvider.childContextTypes = {
  actionStream: actionStreamShape.isRequired
}
