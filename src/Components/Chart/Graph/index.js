import React, { Component } from 'react';

import Snap from 'snapsvg-cjs';

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
      color: "#b356fa"
    }

    // Bind functions
    this.createSnapComponent = this.createSnapComponent.bind(this)
    this.plotData = this.plotData.bind(this)
    this.getHeight = this.getHeight.bind(this)
    this.getScrollPosition = this.getScrollPosition.bind(this)
    this.hoverSVG = this.hoverSVG.bind(this)
  }

  // Setup snap component and canvas height
  componentDidMount() {
    this.createSnapComponent()
    this.getHeight()

    if (this.props.marker) {
      this.helper = new Helper
      this.markerHelper = this.helper.build(this.snap, this.canvas.offsetHeight)
    }
  }

  // Plot the data after the component has mounted
  componentDidUpdate(prevProps, prevState) {
    if (this.state.canvasHeight !== prevState.canvasHeight) {
      this.plotData()
    }

    this.getScrollPosition()
  }

  hoverSVG(event) {
    let posX = event.offsetX

    this.markerHelper.update(posX)

    let intersection = this.markerHelper.getIntersection(Snap, this.currentLine)
    let posY = intersection ? intersection.y : null

    this.marker.updatePosition({
      top: posY,
      left: posX
    })

  }

  getScrollPosition() {

    this.scrollX = this.canvas.scrollLeft
    this.markerHelper.update(this.scrollX)

    // let posY = Func.convert(this.props.data[0], this.state.smallest, this.state.largest, this.state.canvasHeight)
    // posY = this.props.margin ? posY + this.props.margin : posY

    let intersection = this.markerHelper.getIntersection(Snap, this.currentLine)
    let posY = intersection ? intersection.y : null

    if (intersection) {
      this.marker.updatePosition({
        top: posY,
        left: "50%"
      })
    }

  }

  // Get the height of the canvas
  getHeight() {
    let canvasHeight = this.canvas.offsetHeight

    if (this.props.margin) {
      canvasHeight -= this.props.margin*2
    }

    this.setState({ canvasHeight: canvasHeight })
  }

  // Create the snap element (canvas)
  createSnapComponent() {

    let SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")

    this.canvas.appendChild(SVG)

    SVG.setAttribute("class", styles.svg)
    SVG.setAttribute("style", `width: ${this.props.xWidth * (this.state.data.length - 1)}px;`)

    if (!this.props.centered) {
      // document.addEventListener("mouseover", this.hoverSVG)
    } else {
      this.canvas.addEventListener("scroll", this.getScrollPosition)
    }

    this.snap = Snap(SVG)

  }

  // Plot the data on the canvas
  plotData() {

    let straight = Type.straight(
      this.state.data,
      this.state.smallest,
      this.state.largest,
      this.state.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )
    let curve = Type.strictCurve(
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
      stroke: "#00f"
    })

    this.currentLine = graphC

  }

  // Render component
  render() {

    let containerClass = this.props.centered ? (
      `${styles.container} ${styles.centered}`
    ) : styles.container

    return(
      <div
        ref={(elem) => {this.canvas = elem}}
        className={containerClass}
      >
        {this.props.marker ? (
          <Marker
            ref={(elem) => {this.marker = elem}}
            color={this.state.color}
          />
        ) : null}
      </div>
    )
  }
}

Chart.defaultProps = {
  xWidth: 200,
  margin: 32
}

export default Chart