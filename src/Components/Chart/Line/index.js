import React, { Component } from 'react';
import Snap from 'snapsvg-cjs';

import styles from './styles.css';

class Line extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.props.data,
      smallest: this.props.smallest,
      largest: this.props.largest,
      canvasHeight: this.props.canvasHeight,
      xWidth: this.props.xWidth,
      margin: this.props.margin
    }

    this.plotData = this.plotData.bind(this)
  }

  // Plot the data on the canvas
  plotData() {

    let curve = Type.strictCurve(
      this.state.data,
      this.state.smallest,
      this.state.largest,
      this.state.canvasHeight,
      this.state.xWidth,
      this.state.margin
    )

    this.line = this.state.snap ? this.state.snap.path(curve) : null
    if (this.state.snap) { 
      this.line.attr({
        fill: "none",
        stroke: "#00f"
      })
    }

  }

}

Line.defaultProps = {
  smallest: 0,
  largest: 100,
  canvasHeight: 600,
  xWidth: 200,
  margin: 32
}

export default Line