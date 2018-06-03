import React, { Component } from 'react';
import Snap from 'snapsvg-cjs';

import Type from '../src/lineTypes';

import styles from './styles.css';

class Line {
  constructor(props) {

    this.state = {
      data: props.data,
      smallest: props.smallest,
      largest: props.largest,
      canvasHeight: props.canvasHeight,
      xWidth: props.xWidth,
      margin: props.margin,
      snap: props.snap,
      color: props.color
    }

    this.plotData()

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
        stroke: this.state.color
      })
    }

  }

  updatePath(options) {

    let newCurve = Type.strictCurve(
      this.state.data,
      this.state.smallest,
      this.state.largest,
      this.state.canvasHeight,
      options.xWidth,
      this.state.margin
    )

    this.line.attr({
      d: newCurve
    })

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