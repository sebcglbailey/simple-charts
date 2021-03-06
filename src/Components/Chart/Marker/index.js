import React, { Component } from 'react';

import styles from './styles.css';

import Helper from './helper';

class Marker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.props.value ? this.props.value : null,
      label: this.props.label ? this.props.label : null,
      style: {
        backgroundColor: this.props.color
      }
    }

    this.updatePosition = this.updatePosition.bind(this)
    this.updateValue = this.updateValue.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.label !== this.props.label) {
      this.setState({ label: nextProps.label })
    }
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value })
    }
  }

  updatePosition(options) {

    let position = options.position
    let scroll = options.scroll

    this.lastScrollLeft = position.left ? scroll : this.lastScrollLeft ? this.lastScrollLeft : null
    this.lastLeft = position.left ? position.left : this.lastLeft ? this.lastLeft : null
    let currentScroll = !position.left? scroll : null

    let top = position.top ? position.top : this.state.style.top
    let left = position.left ? position.left : currentScroll ? this.lastLeft - (currentScroll - this.lastScrollLeft) : this.state.style.left

    this.setState({
      style: {
        backgroundColor: this.props.color,
        top: top,
        left: left
      }
    })

  }

  updateValue(value) {

    this.setState({
      value: value
    })

  }

  render() {
    let hasValue = this.state.value || typeof(this.state.value == "number")

    return (
      <div
        className={styles.marker}
        style={this.state.style}
      >
        <div
          ref={(elem) => {this.labels = elem}}
          className={styles.labels}
        >
          {hasValue ? (
            <div className={styles.value}>{this.state.value}</div>
          ) : null}
          {this.state.label ? (
            <div className={styles.label}>{this.state.label}</div>
          ) : null}
        </div>
      </div>
    )
  }
}

Marker.defaultProps = {
  color: "#fff"
}

export default Marker
exports.Helper = Helper