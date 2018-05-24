import React, { Component } from 'react';

import Snap from 'snapsvg-cjs';

import Canvas from '../Canvas/';
import SVG from '../SVG/';
import Line from '../Line/';
import Marker, { Helper } from '../Marker/';

import styles from './styles.css';
import Func from '../src/functions';
import Type from '../src/lineTypes';

let defaultData = [0, 20, 50, 25, 75, 60, 100]

class Chart extends Component {
  constructor(props) {
    super(props)

    // Setup if data is passed into component
    let data = this.props.data ? this.props.data : defaultData;

    // Set state
    this.state = {
      data: data,
      smallest: Func.getSmallest(data),
      largest: Func.getLargest(data),
      xWidth: this.props.xWidth,
      color: "#b356fa"
    }

    this.touch = false

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
    this.createSnapComponent()
    this.getHeight()

    if (this.props.marker) {
      this.helper = new Helper
      this.markerHelper = this.helper.build(this.snap, this.canvasNode.offsetHeight)
    }

    this.canvasNode.addEventListener("click", this.switchToYears)

  }

  // Plot the data after the component has mounted
  componentDidUpdate(prevProps, prevState) {
    if (this.state.canvasHeight !== prevState.canvasHeight) {
      this.plotData()
    }

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

  switchToYears() {

    this.years = this.years !== undefined ? !this.years : true

    let xWidth = this.years ? this.props.xWidth / 6 : this.props.xWidth

    let newCurve = Type.strictCurve(
      this.state.data,
      this.state.smallest,
      this.state.largest,
      this.state.canvasHeight,
      xWidth,
      this.props.margin
    )

    this.currentLine.attr({
      d: newCurve
    })

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
      snap: this.snap
    })

    this.currentLine = curve.line

  }

  updateHelper(posX, scroll) {

    this.markerHelper.update(posX)
    this.updateMarker(posX, scroll)

  }

  updateMarker(posX, scroll) {

    let intersection = this.markerHelper.getIntersection(Snap, this.currentLine)
    let posY = intersection ? intersection.y : null
    let posLeft = posX - scroll
    posLeft += this.props.centered ? window.innerWidth / 2 : 0

    if (posX < 0) {
      posLeft -= posX
    } else if (posX > this.svg.width.baseVal.value) {
      posLeft -= posX - this.svg.width.baseVal.value
    }

    let nearest = Func.roundToNearest(posX, this.state.xWidth)
    let index = nearest / this.state.xWidth
    let val = this.state.data[index]

    this.marker.updatePosition({
      top: posY,
      left: posLeft
    })

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