import Snap from 'snapsvg-cjs';
import Func from '../src/functions';

import Type from '../src/lineTypes';

class Line {
  constructor(props) {

    this.props = props
    this.series = props.series
    this.name = props.name

    this.svg = props.svg

    this.snap = Snap(props.svg)

    this.plotData()
    this.plotHelper()

  }

  // Plot the data on the canvas
  plotData() {

    this.curve = Type.strictCurve(
      this.series.dataArray,
      this.series.min,
      this.series.max,
      this.props.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )

    this.bgCurve = Type.addClose(
      this.curve,
      this.series.dataArray,
      this.series.min,
      this.props.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )

    this.start = Type.start(
      this.series.dataArray,
      this.props.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )

    this.bgStart = Type.addClose(
      this.start,
      this.series.dataArray,
      this.props.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )

    this.line = this.snap ? this.snap.path(this.curve) : null
    this.bg = this.snap ? this.snap.path(this.bgCurve) : null

    let bgColor1 = Func.hexToRgb(this.series.color, 0.5)
    let bgColor2 = Func.hexToRgb(this.series.color, 0)
    let bgStop = 1 - Func.median(this.series.dataArray) / this.series.max
    
    if (this.snap) { 
      let bgFill = this.snap.gradient(`l(0.5,0.4,0.5,0.8)${bgColor1}:${bgStop}-${bgColor2}:0`);

      this.line.attr({
        fill: "none",
        stroke: this.series.color,
        opacity: 0.5,
        strokeLinecap: "round"
      })
      this.bg.attr({
        fill: bgFill,
        opacity: 0.5
      })

      if (this.series.parent) {
        this.line.attr({
          opacity: 0,
          d: this.start
        })
        this.bg.attr({
          opacity: 0,
          d: this.bgStart
        })
      }

    }

  }

  plotHelper() {

    let helperPath = `M0,0 V${this.svg.parentNode.offsetHeight}`
    this.markerHelper = this.snap ? this.snap.path(helperPath) : null
    this.clickHelper = this.snap ? this.snap.path(helperPath) : null

    if (this.markerHelper) {
      this.markerHelper.attr({
        stroke: "none"
      })
      this.clickHelper.attr({
        stroke: "none"
      })
    }

  }

  getValue(posX) {

    let index = Math.round(posX / this.props.xWidth)
    let data = this.series.dataArray[index]

    return data

  }

  getMarkerIntersection(posX) {

    let helperPath = `M${posX},0 V${this.svg.parentNode.offsetHeight}`

    if (this.markerHelper) {
      this.markerHelper.attr({
        d: helperPath
      })
    }

    let intersection = Snap ? Snap.path.intersection(this.line, this.markerHelper) : null

    return intersection
  }

  getClosestLineOnClick(visible, posX, posY) {

    let helperPath = `M${posX},-10 V${this.svg.parentNode.offsetHeight+10}`

    if (this.clickHelper) {
      this.clickHelper.attr({
        d: helperPath
      })
    }

    let intersections = []

    visible.forEach((line) => {
      let intersection = Snap ? Snap.path.intersection(line.line, this.clickHelper) : null
      intersections.push(intersection)
    })

    let closestIndex, distance;
    intersections.forEach((intersection, index) => {

      let thisDistance;
      if (intersection[0]) {
        thisDistance = Math.abs(posY - intersection[0].y)
      }

      if (distance == undefined && thisDistance !== undefined && thisDistance !== NaN) {
        distance = thisDistance
        closestIndex = index
      }

      if (thisDistance < distance) {
        distance = thisDistance
        closestIndex = index
      }

    })

    let closestLine = visible[closestIndex]
    let closestSeries = visible[closestIndex].series

    return {closestLine: closestLine, closestSeries: closestSeries}

  }

  updatePath(options) {

    let newCurve = Type.strictCurve(
      this.series.dataArray,
      this.series.min,
      this.series.largest,
      options.canvasHeight,
      options.xWidth,
      options.margin
    )

    this.line.attr({
      d: newCurve
    })

  }

  showBack(duration) {
    this.show(duration, 0.4, 1)
  }

  show(duration, opacity, strokeWidth) {

    opacity = opacity ? opacity : 1
    strokeWidth = strokeWidth ? strokeWidth : 2

    if (duration) {

      this.line.animate({
        opacity: opacity,
        d: this.curve,
        strokeWidth: strokeWidth
      }, duration, mina.easeinout)

      this.bg.animate({
        opacity: opacity,
        d: this.bgCurve
      }, duration, mina.easeinout)

    } else {

      this.line.attr({
        opacity: opacity,
        d: this.curve,
        strokeWidth: strokeWidth
      })

      this.bg.attr({
        opacity: opacity,
        d: this.bgCurve
      })

    }

  }

  hide(duration) {

    if (duration) {

      this.line.animate({
        opacity: 0,
        d: this.start
      }, duration, mina.easeinout)
      this.bg.animate({
        opacity: 0,
        d: this.bgStart
      }, duration, mina.easeinout)

    } else {

      this.line.attr({
        opacity: 0,
        d: this.start
      })
      this.bg.attr({
        opacity: 0,
        d: this.bgStart
      })

    }

  }

  moveToTop() {

    let lineDom = this.line.node
    let bgDom = this.bg.node

    let parentNode = lineDom.parentNode
    let parentChildren = parentNode.children

    lineDom.remove()
    bgDom.remove()

    parentNode.insertBefore(lineDom, parentChildren[parentChildren.length-1])
    parentNode.insertBefore(bgDom, parentChildren[parentChildren.length-1])

  }

}

export default Line