import React, { Component } from 'react';

import Snap from 'snapsvg-cjs'

import styles from './styles.css';
import Func from './functions';
import Type from './lineTypes';

let defaultData = [0, 20, 50, 25, 75, 60, 100]

class Chart extends Component {
  constructor(props) {
    super(props)

    let data = this.props.data ? this.props.data : defaultData;

    this.state = {
      data: data,
      smallest: Func.getSmallest(data),
      largest: Func.getLargest(data)
    }

    this.createSnapComponent = this.createSnapComponent.bind(this)
    this.plotData = this.plotData.bind(this)
    this.getHeight = this.getHeight.bind(this)
  }

  componentDidMount() {
    this.createSnapComponent(this.canvas)
    this.getHeight()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.canvasHeight !== prevState.canvasHeight) {
      this.plotData()
    }
  }

  getHeight() {
    let canvasHeight = this.canvas.offsetHeight

    if (this.props.margin) {
      canvasHeight -= this.props.margin*2
    }

    this.setState({ canvasHeight: canvasHeight })
  }

  createSnapComponent(canvas) {
    canvas.appendChild(this.svg)

    this.snap = Snap(this.svg)
  }

  plotData() {

    let straight = Type.straight(
      this.state.data,
      this.state.smallest,
      this.state.largest,
      this.state.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )
    let curve = Type.simpleCurve(
      this.state.data,
      this.state.smallest,
      this.state.largest,
      this.state.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )

    let graphS = this.snap.path(straight)
    graphS.attr({
      fill: "none",
      stroke: "#fff"
    })

    let graphC = this.snap.path(curve)
    graphC.attr({
      fill: "none",
      stroke: "#fff"
    })

  }

  render() {

    let containerClass = this.props.centered ? (
      `${styles.container} ${styles.centered}`
    ) : styles.container

    return(
      <div
        ref={(elem) => {this.canvas = elem}}
        className={containerClass}
      >
        <svg
          className={styles.svg}
          ref={(elem) => {this.svg = elem}}
          style={{width: this.props.xWidth * (this.state.data.length - 1)}}
        >
        </svg>
      </div>
    )
  }
}

Chart.defaultProps = {
  xWidth: 200,
  margin: 32
}

export default Chart