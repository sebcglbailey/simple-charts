import React, { Component } from 'react';
import Func from '../src/functions';

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
    this.handleScrollerClick = this.handleScrollerClick.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)

    // Binding plotting functions
    this.plotGraph = this.plotGraph.bind(this)
    this.drawLines = this.drawLines.bind(this)

    this.showVisibleLines = this.showVisibleLines.bind(this)

  }

  componentDidMount() {

    window.addEventListener("keydown", this.handleKeyDown)

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
        series: series,
        canvasHeight: canvasHeight - this.state.margin*2,
        xWidth: this.state.xWidth,
        margin: this.state.margin,
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
      return line.name == currentSeries.name
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
      
      this.lines.forEach((line) => {

        if (line == currentLine) {
          line.show()
        } else if (visibleLines.includes(line)) {
          line.showBack()
        } else {
          line.hide()
        }

      })
    }

  }

  handleScrollerClick(event) {

    let mouseX = event.clientX - this.scroller.getBoundingClientRect().left
    let mouseY = event.clientY - this.container.getBoundingClientRect().top

    let posX = mouseX - window.innerWidth / 2 + this.scroller.scrollLeft
    let duration = Math.abs(window.innerWidth/2 - mouseX)
    duration = Func.modulate(duration, [0, window.innerWidth/2], [200, 300])

    Func.scrollTo(this.scroller, posX, duration)

    let {closestLine, closestSeries} = this.state.currentLine ? this.state.currentLine.getClosestLineOnClick(this.state.visibleLines, posX, mouseY) : null

    if (!closestSeries) {
      return
    }

    if (closestLine !== this.state.currentLine) {

      let visibleLines = this.lines.filter((line) => {

        return closestSeries.children.includes(line.name) || line == closestLine

      })

      this.setState({
        currentLine: closestLine,
        currentSeries: closestSeries,
        visibleLines: visibleLines
      })

    } else {

      let markerIndex = this.state.currentLine.getIndex(posX)
      let markerValue = this.state.currentLine.getValue(markerIndex)
      
      let seriesMonth = this.state.currentSeries && this.state.currentSeries.data ? this.state.currentSeries.data[markerIndex] : null
      let seriesEvents = seriesMonth ? seriesMonth.events : undefined
      
      if (seriesEvents && seriesEvents.length > 0) {
        this.setState({
          currentEvents: seriesEvents
        })
      }

    }

  }

  handleKeyDown(event) {

    if (event.keyCode == 27) {

      let goToLine;

      let parent = this.state.currentLine && this.state.currentLine.series ? this.state.currentLine.series.parent : undefined

      if (parent) {
        goToLine = this.lines.filter((line) => {
          return line.name == parent
        })[0]
      } else {
        goToLine = this.lines.filter((line) => {
          return line.series.default
        })[0]
      }

      let visibleLines = this.lines.filter((line) => {

        return goToLine.series.children.includes(line.name) || line == goToLine

      })

      if (goToLine !== this.state.currentLine) {
        this.setState({
          currentLine: goToLine,
          currentSeries: goToLine.series,
          visibleLines: visibleLines
        })
        this.scroller.scrollLeft = this.scroller.scrollLeft
      }

    }

  }

  render() {
    let margin = `${this.state.margin}px 0`
    let height = `calc(100% - ${this.state.margin*2}px)`

    return(
      <div
        ref={(elem) => {this.container = elem}}
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
          onClick={this.handleScrollerClick}
          width={this.state.canvasWidth + window.innerWidth / 2}
        />
      </div>
    )

  }
}

export default Graph