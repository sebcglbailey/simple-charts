import React, { Component } from 'react';

import styles from './styles.css';

import Helper from './helper';

class Marker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      style: {
        backgroundColor: this.props.color
      }
    }

    this.updatePosition = this.updatePosition.bind(this)
  }

  updatePosition(position) {

    this.setState({
        style: {
          backgroundColor: this.props.color,
          top: position.top,
          left: position.left
        }
      })

  }

  render() {
    return (
      <div
        className={styles.marker}
        style={this.state.style}
      >
      </div>
    )
  }
}

Marker.defaultProps = {
  color: "#fff"
}

export default Marker
exports.Helper = Helper