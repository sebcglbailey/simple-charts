import React, { Component } from 'react';
import Func from '../src/functions';

import styles from './styles.css';

import Canvas from '../Canvas/';
import Scroller from '../Scroller/';
import Line from '../Line/';
import Marker from '../Marker/';
import Events from '../Events/';

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

    // Binding keydown functions
    this.moveToParent = this.moveToParent.bind(this)
    this.moveUp = this.moveUp.bind(this)
    this.moveDown = this.moveDown.bind(this)
    this.moveSide = this.moveSide.bind(this)

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

    let markerIndex = this.state.currentLine.getIndex(scrollLeft + window.innerWidth/2)

    this.setState({
      canvasLeft: -scrollLeft,
      scrollLeft: scrollLeft,
      markerIndex: markerIndex
    })

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

    let newScroll = Math.round(posX/200)*200
    if (newScroll == this.canvas.offsetWidth) {
      newScroll -= 1
    } else if (newScroll == 0) {
      newScroll = 1
    }

    let duration = Math.abs(window.innerWidth/2 - mouseX)
    duration = Func.modulate(duration, [0, window.innerWidth/2], [200, 300])

    Func.scrollTo(this.scroller, newScroll, duration)

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
        visibleLines: visibleLines,
        currentEvents: null
      })

    }

    if (closestSeries.parent) {
      return
    }

    let clickDiffToPoint = posX%this.state.xWidth
    let ratio = window.innerWidth < 640 ? 0.2 : 0.05

    if (clickDiffToPoint < this.state.xWidth*ratio || clickDiffToPoint > this.state.xWidth*(1-ratio)) {

      let markerIndex = closestLine.getIndex(posX)
      
      let seriesMonth = closestSeries && closestSeries.data ? closestSeries.data[markerIndex] : null
      let seriesEvents = seriesMonth ? seriesMonth.events : undefined
      
      if (seriesEvents && seriesEvents.length > 0) {
        this.setState({
          currentEvents: seriesEvents,
          eventsShowing: true,
          markerIndex: markerIndex
        })
      } else {
        this.setState({
          currentEvents: null,
          eventsShowing: false
        })
      }

    } else {
      this.setState({
        currentEvents: null,
        eventsShowing: false
      })
    }

  }

  moveUp() {
    let {lineUp, seriesUp} = this.state.currentLine.getLineUp(this.state.currentSeries.children, this.state.visibleLines, this.state.series)

    if (lineUp && seriesUp) {

        let visibleLines = this.lines.filter((line) => {
          return seriesUp.children.includes(line.name) || line == lineUp
        })

        this.setState({
          currentLine: lineUp,
          currentSeries: seriesUp,
          visibleLines: visibleLines
        })

    }

  }

  moveDown() {
    let {lineDown, seriesDown} = this.state.currentLine.getLineDown(this.state.currentSeries.children, this.state.visibleLines, this.state.series)

    if (lineDown && seriesDown) {

      let visibleLines = this.lines.filter((line) => {
        return seriesDown.children.includes(line.name) || line == lineDown
      })

      this.setState({
        currentLine: lineDown,
        currentSeries: seriesDown,
        visibleLines: visibleLines
      })

    }

  }

  moveSide(direction) {

    let move, diff;
    let currentScroll = this.scroller.scrollLeft

    if (direction == "left") {
      diff = currentScroll - (Math.floor(currentScroll/200) * 200)
      if (diff == 0) {
        diff = 200
      }
      move = -diff
    } else if (direction == "right") {
      diff = currentScroll - (Math.floor(currentScroll/200) * 200)
      move = 200 - diff
    }

    let newScroll = this.scroller.scrollLeft + move

    if (newScroll == this.canvas.offsetWidth) {
      newScroll -= 1
    } else if (newScroll == 0) {
      newScroll = 1
    }

    Func.scrollTo(this.scroller, newScroll, 200)

  }

  moveToParent() {

    if (this.state.eventsShowing) {
      this.setState({
        currentEvents: null,
        eventsShowing: false
      })
      return
    }

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

  handleKeyDown(event) {

    if (event.keyCode == 27) {

      this.moveToParent()

    } else if (event.keyCode == 38) {

      this.moveUp()

    } else if (event.keyCode == 40) {

      this.moveDown()

    } else if (event.keyCode == 37) {

      this.moveSide("left")

    } else if (event.keyCode == 39) {

      this.moveSide("right")

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
        />
        <Events
          ref={(elem) => {this.events = elem}}
          eventList={this.state.currentEvents}
          margin={this.state.margin}
          svgWidth={this.state.canvasWidth}
          scrollLeft={this.state.canvasLeft}
          currentLine={this.state.currentLine}
          currentSeries={this.state.currentSeries}
          eventIndex={this.state.markerIndex}
        />
        <Scroller
          ref={(elem) => {
            this.scroller = this.scroller ? this.scroller : elem ? elem.container : null
          }}
          onScroll={this.updateScrollPosition}
          onClick={this.handleScrollerClick}
          width={this.state.canvasWidth + window.innerWidth / 2}
        />
        <Marker
          top={this.state.markerTop}
          color={this.state.currentSeries ? this.state.currentSeries.color : null}
          value={this.state.markerValue}
          label={this.state.currentSeries ? this.state.currentSeries.name : null}
          currentSeries={this.state.currentSeries}
          currentLine={this.state.currentLine}
          visibleLines={this.state.visibleLines}
          canvasLeft={this.state.canvasLeft}
          scrollLeft={this.state.scrollLeft}
          margin={this.state.margin}
        />
      </div>
    )

  }
}

export default Graph