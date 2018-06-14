import React, { Component } from 'react';

import styles from './styles.css';

class SVG extends Component {
  constructor(props) {
    super(props)

    this.state = {
      width: this.props.width
    }

  }

  componentDidMount() {

    let axis = []

    for (let i = 0; i <= this.props.length; i++) {

      let path = `M${i * this.props.xWidth},0 V${this.elem.parentNode.offsetHeight}`

      axis.push(
        <path
          key={`axisMarker-${i+1}`}
          d={path}
          stroke="rgba(255,255,255,0.2)"
        >
        </path>
      )

    }

    this.setState({axisMarkers: axis})

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
        {this.state.axisMarkers}
      </svg>
    )
  }
}

export default SVG