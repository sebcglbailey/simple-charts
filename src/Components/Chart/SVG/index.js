import React, { Component } from 'react';

import styles from './styles.css';

class SVG extends Component {
  constructor(props) {
    super(props)

    this.state = {
      width: this.props.width
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.width !== this.props.width) {
      this.setState({ width: nextProps.width })
    }
  }

  render() {
    return(
      <svg
        ref={(elem) => this.elem = elem}
        className={styles.svg}
        style={{width: this.state.width}}
      >
      </svg>
    )
  }
}

export default SVG