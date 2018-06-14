import React, { Component } from 'react';

import styles from './styles.css';

class SVG extends Component {
  constructor(props) {
    super(props)

    this.state = {
      width: this.props.xWidth * (this.props.length-1)
    }

    this.getAxisMarkers = this.getAxisMarkers.bind(this)
  }

  componentDidMount() {
    this.getAxisMarkers()
  }

  getAxisMarkers() {

    let axis = []

    for (let i = 0; i < this.props.length; i++) {

      let path = `M${i * this.props.xWidth},0 V${this.svg.parentNode.offsetHeight}`

      axis.push(
        <path
          key={`axisMarker-${i+1}`}
          d={path}
          stroke="rgba(255,255,255,0.2)"
        >
        </path>
      )

    }

    this.setState({ axisMarkers: axis })

  }

  render() {
    return(
      <svg
        ref={(elem) => {this.svg = this.svg ? this.svg : elem}}
        className={styles.svg}
        style={{width: this.state.width}}
      >
        {this.state.axisMarkers}
      </svg>
    )
  }
}

export default SVG