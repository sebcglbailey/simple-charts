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

    // Set state
    this.state = {
      data: this.props.data,
      smallest: Func.getSmallest(this.props.data),
      largest: Func.getLargest(this.props.data),
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
    this.updateMarker = this.updateMarker.bind(this)
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
    this.canvasNode.addEventListener("click", this.switchToYears)

  }

  // Plot the data after the component has mounted & updated its state with snap and height
  componentDidUpdate(prevProps, prevState) {
    if (this.state.canvasHeight !== prevState.canvasHeight) {
      this.plotData()
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
      svgWidth: this.props.xWidth * (this.state.data.length - 1)
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
    let currentWidth = this.state.xWidth * (this.state.data.length - 1)
    let newWidth = xWidth * (this.state.data.length - 1)
    let newScroll = Func.modulate(this.canvasNode.scrollLeft, [0, currentWidth], [0, newWidth])

    this.setState({
      xWidth: xWidth,
      svgWidth: xWidth * (this.state.data.length - 1),
      canvasScroll: newScroll
    })

  }

  // Plot the data on the canvas
  plotData() {

    let curve = new Line({
      data: this.state.data,
      smallest: this.state.smallest,
      largest: this.state.largest,
      canvasHeight: this.state.canvasHeight,
      xWidth: this.props.xWidth,
      margin: this.props.margin,
      snap: this.snap,
      color: this.state.color
    })
    this.currentLine = curve

  }

  // Update the vertical helper to the current scroll / hover position
  updateHelper(posX, scroll) {

    this.markerHelper.update(posX)
    this.updateMarker(posX, scroll)

  }

  // Update the marker on the current line to position of the helper
  // Intersects with the current line
  updateMarker(posX, scroll) {

    // Get the intersection point with the current line
    let intersection = this.markerHelper.getIntersection(Snap, this.currentLine.line)
    let posY = intersection ? intersection.y : null
    // Get the left position of the marker
    let posLeft = posX - scroll
    posLeft += this.props.centered ? window.innerWidth / 2 : 0

    // Change the left position of the marker if bounds are beyond the line
    if (posX < 0) {
      posLeft -= posX
    } else if (posX > this.svg.width.baseVal.value) {
      posLeft -= posX - this.svg.width.baseVal.value
    }

    // Getting the nearest value to the marker
    let nearest = Func.roundToNearest(posX, this.state.xWidth)
    let index = nearest / this.state.xWidth
    let val = this.state.data[index]

    // Call the marker to update its position
    this.marker.updatePosition({
      top: posY,
      left: posLeft
    })

    // If there is a value update, update the value of the marker label
    if (val) {
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
        scrollLeft={this.state.canvasScroll}
      >
        <SVG
          ref={(elem) => {this.svg = elem ? elem.elem : null}}
          snap={this.state.snap}
          width={this.state.svgWidth}
        />
        {this.props.marker ? (
          <Marker
            ref={(elem) => {this.marker = elem}}
            color={this.state.color}
            value={this.state.data ? this.state.data[0] : null}
            label="Score"
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