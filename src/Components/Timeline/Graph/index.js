import React, { Component } from 'react';

import styles from './styles.css';

import Canvas from '../Canvas/';
import Scroller from '../Scroller/';
import Line from '../Line/';
import Marker from '../Marker/';

class Graph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      series: this.props.series,
      margin: this.props.margin,
      length: this.props.length,
      xWidth: this.props.xWidth,
      canvasWidth: (this.props.length-1) * this.props.xWidth
    }

    this.updateScrollPosition = this.updateScrollPosition.bind(this)

    // Binding plotting functions
    this.plotGraph = this.plotGraph.bind(this)
    this.drawLines = this.drawLines.bind(this)

    this.showVisibleLines = this.showVisibleLines.bind(this)

  }

  componentDidMount() {

    // this.scroller.scrollLeft = this.state.length * this.state.xWidth
    this.scroller.scrollLeft = this.svg.getBoundingClientRect().width - 1

    this.plotGraph()

  }

  componentDidUpdate(nextProps, nextState) {

    if (nextState.currentLine !== this.state.currentLine) {

      this.showVisibleLines()

    }

  }

  updateScrollPosition(scrollLeft) {

    this.setState({ canvasLeft: -scrollLeft })

  }

  /*
    ----------------------------------
    Plotting the graph
    ----------------------------------
  */

  // Run plotting functions
  plotGraph() {

    this.snap = Snap(this.svg)
    this.drawLines()

  }

  drawLines() {

    let canvasHeight = this.canvas.offsetHeight

    this.lines = []
    let visibleLines = []

    this.state.series.forEach((series, index) => {

      let line = new Line({
        name: series.name,
        data: series.dataArray,
        min: series.min,
        max: series.max,
        canvasHeight: canvasHeight - this.state.margin*2,
        xWidth: this.state.xWidth,
        margin: this.state.margin,
        color: series.color,
        parent: series.parent,
        children: series.children,
        svg: this.svg
      })

      this.lines.push(line)

      if (!series.parent) {
        visibleLines.push(line)
      }

    })

    let currentSeries = this.state.series.filter((series) => {
      return series.default
    })[0]
    let currentLine = this.lines.filter((line) => {
      return line.name = currentSeries.name
    })[0]

    this.setState({
      currentLine: currentLine,
      currentSeries: currentSeries,
      visibleLines: visibleLines
    })

    this.showVisibleLines(visibleLines, currentLine)

  }

  showVisibleLines(visible, current) {

    let visibleLines = visible ? visible : this.state.visibleLines
    let currentLine = current? current : this.state.currentLine

    if (visibleLines) {
      
      visibleLines.forEach((line) => {

        if (line == currentLine) {
          line.show()
        } else {
          line.showBack()
        }

      })
    }

  }

  render() {
    let margin = `${this.state.margin}px 0`
    let height = `calc(100% - ${this.state.margin*2}px)`

    return(
      <div
        className={styles.container}
        style={{ margin: margin, height: height}}
      >
        <Canvas
          ref={(elem) => {
            this.canvas = this.canvas ? this.canvas : elem ? elem.canvas : null
            this.svg = this.svg ? this.svg : elem ? elem.svg : null
          }}
          width={this.state.canvasWidth}
          length={this.state.length}
          xWidth={this.state.xWidth}
          scrollLeft={this.state.canvasLeft}
          visibleLines={this.state.visibleLines}
          currentLine={this.state.currentLine}
          currentSeries={this.state.currentSeries}
        />
        <Scroller
          ref={(elem) => {
            this.scroller = this.scroller ? this.scroller : elem ? elem.container : null
          }}
          onScroll={this.updateScrollPosition}
          width={this.state.canvasWidth + window.innerWidth / 2}
        />
      </div>
    )

  }
}

export default Graph