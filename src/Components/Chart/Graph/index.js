import React, { Component } from 'react';

import Snap from 'snapsvg-cjs';

import Canvas from '../Canvas/';
import SVG from '../SVG/';
import Line from '../Line/';
import Marker, { Helper } from '../Marker/';

import styles from './styles.css';
import Func from '../src/functions';
import Type from '../src/lineTypes';

class Chart extends Component {
  constructor(props) {
    super(props)

    let smallestArr = [], largestArr = [], seriesLength = [];

    this.props.series.forEach((series) => {

      seriesLength.push(series.data.length)

    })

    let length = this.props.length ? this.props.length : Func.getLargest(seriesLength);

    // Set state
    this.state = {
      length: length,
      xWidth: this.props.xWidth,
      color: "#b356fa"
    }

    this.defaultLine = {
      data: this.props.data,
      xWidth: this.props.xWidth,
      margin: this.props.margin
    }

    // Bind functions
    this.createSnapComponent = this.createSnapComponent.bind(this)
    this.plotData = this.plotData.bind(this)
    this.getHeight = this.getHeight.bind(this)
    this.switchToYears = this.switchToYears.bind(this)
    this.updateHelper = this.updateHelper.bind(this)
    this.updateHelperOnClick = this.updateHelperOnClick.bind(this)
    this.updateMarker = this.updateMarker.bind(this)
    this.findNearestLine = this.findNearestLine.bind(this)
  }

  // Setup snap component and canvas height
  componentDidMount() {
    // Setup snap instance and svg width
    this.createSnapComponent()
    // Get the height of the canvas
    this.getHeight()

    // Create a marker instance if called on graph
    if (this.props.marker) {
      this.helper = new Helper
      this.markerHelper = this.helper.build(this.snap, this.canvasNode.offsetHeight)
    }

    // Switch to years if canvas is clicked
    // this.canvasNode.addEventListener("click", this.switchToYears)

  }

  // Plot the data after the component has mounted & updated its state with snap and height
  componentDidUpdate(prevProps, prevState) {
    if (this.state.canvasHeight !== prevState.canvasHeight) {
      this.plotData()
    }

    if (!this.state.mounted) {
      // Set the position of the graph to the far right
      this.canvas.elem.scrollLeft = this.state.length * this.state.xWidth
      this.setState({ mounted: true })
    }

    // Initiate the position of the marker
    this.canvas.getScrollPosition()
  }

  // Get the height of the canvas
  getHeight() {
    let canvasHeight = this.canvasNode.offsetHeight

    if (this.props.margin) {
      canvasHeight -= this.props.margin*2
    }

    this.setState({ canvasHeight: canvasHeight })
  }

  // Create the snap element (canvas)
  createSnapComponent() {

    let snap = Snap(this.svg)
    
    this.snap = snap
    this.setState({
      snap: snap,
      svgWidth: this.props.xWidth * (this.state.length)
    })

  }

  // Change the width of a month to see more of the graph (i.e. years)
  switchToYears() {

    this.years = this.years !== undefined ? !this.years : true

    // Change the xWidth to be the default or 1/6 of default
    let xWidth = this.years ? this.props.xWidth / 6 : this.props.xWidth

    // Update the current line with the new xWidth
    this.currentLine.updatePath({xWidth: xWidth})

    // Update the scroll position of the canvas relatively
    let currentWidth = this.state.xWidth * (this.currentSeries.data.length - 1)
    let newWidth = xWidth * (this.state.length)
    let newScroll = Func.modulate(this.canvasNode.scrollLeft, [0, currentWidth], [0, newWidth])

    this.setState({
      xWidth: xWidth,
      svgWidth: xWidth * (this.state.length),
      canvasScroll: newScroll
    })

  }

  // Plot the data on the canvas
  plotData() {

    this.lines = []

    this.visibleLines = []
    this.visibleSeries = []

    this.props.series.forEach((series) => {

      let line = new Line({
        name: series.name,
        data: series.dataArray,
        smallest: series.min,
        largest: series.max,
        canvasHeight: this.state.canvasHeight,
        xWidth: this.props.xWidth,
        margin: this.props.margin,
        snap: this.snap,
        color: series.color,
        parent: series.parent,
        children: series.children
      })

      this.lines.push(line)

      if (series.default) {
        this.currentLine = line
        this.currentSeries = series
      }

      if (!series.parent) {
        this.visibleLines.push(line)
        this.visibleSeries.push(series)
      }

    })

    this.visibleSeries.forEach((series, index) => {
      if (series.default) {
        this.visibleLines[index].show()
      } else {
        this.visibleLines[index].showBack()
      }
    })

    this.setState({
      currentLine: this.currentLine,
      currentSeries: this.currentSeries,
      color: this.currentSeries.color
    })

  }

  // Update the vertical helper to the current scroll / hover position
  updateHelper(posX, scroll) {

    this.markerHelper.update(posX)
    this.updateMarker(posX, scroll)

  }

  // Update the vertical helper to the current click position
  updateHelperOnClick(posX, posY) {

    this.markerHelper.updateClick(posX)
    this.findNearestLine(posX, posY)

    let visibleLines = []
    let visibleSeries = []

    this.lines.map((line, index) => {
      let lineName = line.state.name

      if (line == this.currentLine) {
        line.show()
        visibleLines.push(line)
        visibleSeries.push(this.props.series[index])
      } else if (this.currentLine.state.children && this.currentLine.state.children.includes(lineName)) {
        // Add in duration in ms to show() function to animate in
        line.showBack()
        visibleLines.push(line)
        visibleSeries.push(this.props.series[index])
      } 
      else {
        // Add in duration in ms to hide() function to animate out
        line.hide()
      }
    })

    this.visibleLines = visibleLines
    this.visibleSeries = visibleSeries

  }

  findNearestLine(posX, posY) {

    let intersections = this.markerHelper.getAllIntersections(Snap, this.visibleLines, posX)

    let closestIndex;
    let difference;

    intersections.forEach((intersection, index) => {

      if (!difference && intersection) {
        difference = Math.abs(posY - intersection.y)
        closestIndex = index
      }

      if (intersection && Math.abs(posY - intersection.y) < difference) {
        closestIndex = index
        difference = Math.abs(posY - intersection.y)
      }

    })

    this.currentLine = this.visibleLines[closestIndex]
    this.currentSeries = this.visibleSeries[closestIndex]
    this.updateMarker(posX)
    this.setState({
      color: this.currentSeries.color,
      currentSeries: this.currentSeries,
      currentLine: this.currentLine
    })

    Func.scrollTo(this.canvas.elem, posX, 350)

    this.currentLine.moveToTop()

  }

  // Update the marker on the current line to position of the helper
  // Intersects with the current line
  updateMarker(posX, scroll) {

    // Get the intersection point with the current line
    let intersection = this.markerHelper.getIntersection(Snap, this.currentLine.line)
    let posY = intersection ? intersection.y : null
    
    // Get the left position of the marker
    let posLeft = null;
    if (intersection) {
      posLeft = posX - scroll
      posLeft += this.props.centered ? window.innerWidth / 2 : 0
    }


    // Change the left position of the marker if bounds are beyond the line
    if (posX < 0) {
      posLeft -= posX
    } else if (posX > this.svg.width.baseVal.value) {
      posLeft -= posX - this.svg.width.baseVal.value
    }

    // Getting the nearest value to the marker
    let nearest = Func.roundToNearest(posX, this.state.xWidth)
    let index = nearest / this.state.xWidth
    let val = this.currentSeries && this.currentSeries.dataArray ? this.currentSeries.dataArray[index] : null

    // Call the marker to update its position
    this.marker.updatePosition({
      position: {
        top: posY,
        left: posLeft
      },
      scroll: scroll
    })

    // If there is a value update, update the value of the marker label
    if (typeof(val) == "number" && val !== NaN) {

      if (this.state.currentSeries && this.state.currentSeries.formatValue) {
        val = this.state.currentSeries.formatValue(val)
      }

      this.marker.updateValue(val)
    }

  }

  // Render component
  render() {

    return(
      <Canvas
        ref={(elem) => {
          this.canvasNode = elem ? elem.elem : null
          this.canvas = elem ? elem : null
        }}
        centered={this.props.centered}
        updateHelper={this.updateHelper}
        updateHelperOnClick={this.updateHelperOnClick}
        scrollLeft={this.state.canvasScroll}
      >
        <SVG
          ref={(elem) => {this.svg = elem ? elem.elem : null}}
          snap={this.state.snap}
          width={this.state.svgWidth}
          xWidth={this.props.xWidth}
          length={this.state.length}
        />
        {this.props.marker ? (
          <Marker
            ref={(elem) => {this.marker = elem}}
            color={this.state.color}
            value={
              this.state.currentSeries && this.state.currentSeries.dataArray && this.state.currentSeries.formatValue ?
                this.state.currentSeries.formatValue(this.state.currentSeries.dataArray[this.state.currentSeries.dataArray.length - 1]) :
              this.state.currentSeries && this.state.currentSeries.dataArray ?
                this.state.currentSeries.dataArray[this.state.currentSeries.dataArray.length - 1] :
                null}
            label={this.state.currentSeries ? this.state.currentSeries.name : null}
          />
        ) : null}
      </Canvas>
    )
  }
}

Chart.defaultProps = {
  xWidth: 200,
  margin: 32
}

export default Chart