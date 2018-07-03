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

    if (!this.series.parent) {
      this.plotEvents()
    }

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

  plotEvents() {

    if (this.snap) {

      this.events = []

      this.series.data.forEach((dataPoint, index) => {
        if (dataPoint.events) {
          
          let xCoord = index * this.props.xWidth
          let yCoord = Func.convert(this.series.dataArray[index], this.series.min, this.series.max, this.props.canvasHeight) + this.props.margin

          let event = this.snap.circle(xCoord, yCoord, 6)
          event.attr({
            fill: this.series.color,
            stroke: "#fff",
            strokeWidth: 3,
            opacity: this.series.default ? 1 : 0.1
          })

          this.events.push(event)

        }
      })

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

  getIndex(posX) {

    let index = Math.round(posX / this.props.xWidth)
    return index

  }

  getValue(index) {

    let data = this.series.dataArray[index]

    return data

  }

  getIntersectionsOfChildren(visibleLines) {

    let intersections = []
    let currentIntersection = Snap ? Snap.path.intersection(this.line, this.markerHelper) : null
    currentIntersection = currentIntersection && currentIntersection[0] ? currentIntersection[0] : null

    let otherLines = visibleLines.filter((line) => {
      return line.line !== this.line
    })

    visibleLines.forEach((line) => {
      let intersection = Snap ? Snap.path.intersection(line.line, this.markerHelper) : null
      intersection = intersection && intersection[0] ? intersection[0] : null
      intersections.push(intersection)
    })

    return {currentIntersection: currentIntersection, intersections: intersections}

  }

  getLineUp(children, visibleLines, series) {

    let ignore = series.filter((series) => {
      return series.default
    })
    visibleLines = visibleLines.filter((line) => {
      return !ignore.includes(line.series)
    })

    let {currentIntersection, intersections} = this.getIntersectionsOfChildren(visibleLines)

    let goToIndex;
    let closestDistance;

    intersections.forEach((intersection, index) => {

      if (intersection && closestDistance == undefined) {
        closestDistance = currentIntersection.y - intersection.y > 0 ? currentIntersection.y - intersection.y : undefined
        goToIndex = currentIntersection.y - intersection.y > 0 ? index : undefined
      }

      if (intersection && currentIntersection.y - intersection.y < closestDistance && currentIntersection.y - intersection.y > 0) {
        closestDistance = currentIntersection.y - intersection.y
        goToIndex = index
      }

    })

    goToIndex = goToIndex || goToIndex == 0 ? goToIndex : 0

    let closestLine = visibleLines[goToIndex]

    if (children.includes(closestLine.name)) {
      return {lineUp: closestLine, seriesUp: closestLine.series}
    } else {
      return {lineUp: null, seriesUp: null}
    }

  }

  getLineDown(children, visibleLines, series) {

    let ignore = series.filter((series) => {
      return series.default
    })
    visibleLines = visibleLines.filter((line) => {
      return !ignore.includes(line.series)
    })

    let {currentIntersection, intersections} = this.getIntersectionsOfChildren(visibleLines)

    let goToIndex;
    let closestDistance;

    intersections.forEach((intersection, index) => {

      if (intersection && closestDistance == undefined) {
        closestDistance = intersection.y - currentIntersection.y > 0 ? intersection.y - currentIntersection.y : undefined
        goToIndex = intersection.y - currentIntersection.y > 0 ? index : undefined
      }

      if (intersection && intersection.y - currentIntersection.y < closestDistance && intersection.y - currentIntersection.y > 0) {
        closestDistance = intersection.y - currentIntersection.y
        goToIndex = index
      }

    })

    goToIndex = goToIndex || goToIndex == 0 ? goToIndex : 0

    let closestLine = visibleLines[goToIndex]

    if (children.includes(closestLine.name)) {
      return closestLine
    } else {
      return null
    }

  }

  getMarkerIntersection(posX) {

    posX = posX == 0 ? 1 : posX - 1

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
    let closestSeries = closestLine ? closestLine.series : null

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

    let eventOpacity = opacity

    opacity = opacity ? opacity : 1
    strokeWidth = strokeWidth ? strokeWidth : 2

    if (duration) {

      if (this.events) {
        this.events.forEach((event) => {
          event.animate({
            opacity: eventOpacity ? 0.1 : 1
          })
        }, duration, mina.easeinout)
      }

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

      if (this.events) {
        this.events.forEach((event) => {
          event.attr({
            opacity: eventOpacity ? 0.1 : 1
          })
        })
      }

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

      if (this.events) {
        this.events.forEach((event) => {
          event.animate({
            opacity: 0
          }, duration, mina.easeinout)
        })
      }

      this.line.animate({
        opacity: 0,
        d: this.start
      }, duration, mina.easeinout)
      this.bg.animate({
        opacity: 0,
        d: this.bgStart
      }, duration, mina.easeinout)

    } else {

      if (this.events) {
        this.events.forEach((event) => {
          event.attr({
            opacity: 0
          })
        })
      }

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