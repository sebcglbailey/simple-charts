import React, { Component } from 'react';

import styles from './styles.css';

class Marker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      line: this.props.line,
      value: this.props.value,
      label: this.props.label,
      style: {
        backgroundColor: this.props.color,
        left: this.props.left && this.props.left !== NaN ? this.props.left : 0,
        top: this.props.top && this.props.top !== NaN ? this.props.top : 0
      }
    }

    this.updateValue = this.updateValue.bind(this)
  }

  componentWillReceiveProps(nextProps) {

    let left = nextProps.left && nextProps.left !== NaN ? nextProps.left : 0
    let top = nextProps.top && nextProps.top !== NaN ? nextProps.top : 0

    this.setState({
      value: nextProps.value,
      label: nextProps.label,
      style: {
        backgroundColor: nextProps.color,
        left: left,
        top: top
      }
    })

  }

  updateValue(value) {

    this.setState({
      value: value
    })

  }

  render() {
    let hasValue = typeof(this.state.value == "number") && this.state.value !== NaN

    return(
      <div
        className={styles.container}
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

export default Marker