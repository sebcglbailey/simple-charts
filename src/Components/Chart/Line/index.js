import React, { Component } from 'react';
import Snap from 'snapsvg-cjs';

import Type from '../src/lineTypes';

import styles from './styles.css';

class Line {
  constructor(props) {

    this.state = {
      name: props.name,
      data: props.data,
      smallest: props.smallest,
      largest: props.largest,
      canvasHeight: props.canvasHeight,
      xWidth: props.xWidth,
      margin: props.margin,
      snap: props.snap,
      color: props.color,
      parent: props.parent,
      children: props.children
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

      if (this.state.parent) {
        this.line.attr({
          opacity: 0
        })
      }
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

  show(duration) {

    this.line.animate({
      opacity: 1
    }, duration, mina.easeinout)

  }

  hide(duration) {

    this.line.animate({
      opacity: 0
    }, duration, mina.easeinout)

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