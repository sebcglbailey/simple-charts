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
      color: "#b356fa"
    }

    this.touch = false

    // Bind functions
    this.createSnapComponent = this.createSnapComponent.bind(this)
    this.plotData = this.plotData.bind(this)
    this.getHeight = this.getHeight.bind(this)
    this.getScrollPosition = this.getScrollPosition.bind(this)
    this.hoverSVG = this.hoverSVG.bind(this)
    this.switchToYears = this.switchToYears.bind(this)
    this.updateHelper = this.updateHelper.bind(this)
  }

  // Setup snap component and canvas height
  componentDidMount() {
    this.createSnapComponent()
    this.getHeight()

    if (this.props.marker) {
      this.helper = new Helper
      this.markerHelper = this.helper.build(this.snap, this.canvas.offsetHeight)

      // this.canvas.addEventListener("mousemove", this.hoverSVG)

      // window.addEventListener("touchstart", () => {
      //   this.touch = true
      //   this.canvas.removeEventListener("mousemove", () => {
      //     console.log("Not listening to mouse move event.")
      //   })
      // })

    }

    this.canvas.addEventListener("click", this.switchToYears)

  }

  // Plot the data after the component has mounted
  componentDidUpdate(prevProps, prevState) {
    if (this.state.canvasHeight !== prevState.canvasHeight) {
      this.plotData()
    }

    this.getScrollPosition()
  }

  hoverSVG(event) {

    let posX = event.clientX
    this.mouseX = posX
    let mouseX = posX - (this.props.centered ? window.innerWidth/2 : 0) + this.canvas.scrollLeft

    this.markerHelper.update(mouseX)

    let intersection = this.markerHelper.getIntersection(Snap, this.currentLine)
    this.posY = intersection ? intersection.y : this.posY ? this.posY : null

    if (intersection) {
      this.marker.updatePosition({
        top: this.posY,
        left: posX
      })

      let nearest = Func.roundToNearest(mouseX, this.props.xWidth)
      let index = nearest / this.props.xWidth
      let val = this.state.data[index]
      if (val) {
        this.marker.updateValue(val)
      }

    }
    

  }

  getScrollPosition() {

    let posX = this.canvas.scrollLeft

    posX += this.mouseX ? this.mouseX - (this.props.centered ? window.innerWidth/2 : 0) : 0

    this.markerHelper.update(posX)

    let intersection = this.markerHelper.getIntersection(Snap, this.currentLine)
    this.posY = intersection ? intersection.y : this.posY ? this.posY : null

    if (intersection) {
      this.marker.updatePosition({
        top: this.posY,
        left: this.mouseX ? this.mouseX : this.props.centered ? "50%" : 0
      })

      let nearest = Func.roundToNearest(posX, this.props.xWidth)
      let index = nearest / this.props.xWidth
      let val = this.state.data[index]
      if (val) {
        this.marker.updateValue(val)
      }

    } else {
      this.marker.updatePosition({
        top: this.posY,
        left: this.props.centered && this.mouseX < window.innerWidth / 2 ? 
          (window.innerWidth / 2 - this.canvas.scrollLeft)
          : this.props.centered && this.mouseX > window.innerWidth / 2 ?
          (window.innerWidth / 2 + (this.svg.width.baseVal.value - this.canvas.scrollLeft))
          : this.canvas.scrollLeft
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

    // this.canvas.addEventListener("scroll", this.getScrollPosition)

    let snap = Snap(this.svg)
    
    this.snap = snap
    this.setState({ snap: snap })

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

    this.currentLine.animate({
      d: newCurve
    }, 800, mina.easeinout)
    this.svg.setAttribute("style", `width: ${xWidth * (this.state.data.length - 1)}px;`)

  }

  // Plot the data on the canvas
  plotData() {

    let curve = Type.strictCurve(
      this.state.data,
      this.state.smallest,
      this.state.largest,
      this.state.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )

    let graphC = this.snap.path(curve)
    graphC.attr({
      fill: "none",
      stroke: "#00f"
    })

    this.currentLine = graphC

  }

  updateHelper(posX) {

    this.markerHelper.update(posX)

  }

  // Render component
  render() {

    return(
      <Canvas
        ref={(elem) => {this.canvas = elem ? elem.elem : null}}
        centered={this.props.centered}
        updateHelper={this.updateHelper}
      >
        <SVG
          ref={(elem) => {this.svg = elem ? elem.elem : null}}
          snap={this.state.snap}
          width={this.props.xWidth * (this.state.data.length - 1)}
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