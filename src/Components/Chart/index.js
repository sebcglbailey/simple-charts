import React, { Component } from 'react';

import Snap from 'snapsvg-cjs'

import styles from './styles.css';
import Func from './functions';

class Chart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      smallest: Func.getSmallest(this.props.data),
      largest: Func.getLargest(this.props.data)
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

    let lineString = this.props.data.map((value, index) => {
      value = Func.convert(value, this.state.smallest, this.state.largest, this.state.canvasHeight)

      if (this.props.margin) {
        value += this.props.margin
      }

      if (index == 0) {
        return `M0,${this.props.data[0]} L`
      } else {
        return `${this.props.xWidth * index},${value} `
      }
    })
    lineString = lineString.join("")
    let graph = this.snap.path(lineString)
    graph.attr({
      fill: "none",
      stroke: "#fff"
    })

  }

  render() {
    return(
      <div
        ref={(elem) => {this.canvas = elem}}
        className={styles.container}
      >
        <svg
          className={styles.svg}
          ref={(elem) => {this.svg = elem}}
          style={{width: this.props.xWidth * (this.props.data.length - 1)}}
        >
        </svg>
      </div>
    )
  }
}

Chart.defaultProps = {
  xWidth: 200
}

export default Chart