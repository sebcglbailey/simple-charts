import Snap from 'snapsvg-cjs';
import Func from '../src/functions';

import Type from '../src/lineTypes';

class Line {
  constructor(props) {

    this.props = props

    this.snap = Snap(props.svg)

    this.plotData()

  }

  // Plot the data on the canvas
  plotData() {

    this.curve = Type.strictCurve(
      this.props.data,
      this.props.min,
      this.props.max,
      this.props.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )

    this.bgCurve = Type.addClose(
      this.curve,
      this.props.data,
      this.props.min,
      this.props.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )

    this.start = Type.start(
      this.props.data,
      this.props.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )

    this.bgStart = Type.addClose(
      this.start,
      this.props.data,
      this.props.canvasHeight,
      this.props.xWidth,
      this.props.margin
    )

    this.line = this.snap ? this.snap.path(this.curve) : null
    this.bg = this.snap ? this.snap.path(this.bgCurve) : null

    let bgColor1 = Func.hexToRgb(this.props.color, 0.5)
    let bgColor2 = Func.hexToRgb(this.props.color, 0)
    let bgStop = 1 - Func.median(this.props.data) / this.props.max
    
    if (this.snap) { 
      let bgFill = this.snap.gradient(`l(0.5,0.4,0.5,0.8)${bgColor1}:${bgStop}-${bgColor2}:0`);

      this.line.attr({
        fill: "none",
        stroke: this.props.color,
        opacity: 0.5,
        strokeLinecap: "round"
      })
      this.bg.attr({
        fill: bgFill,
        opacity: 0.5
      })

      if (this.props.parent) {
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

  updatePath(options) {

    let newCurve = Type.strictCurve(
      this.props.data,
      this.props.min,
      this.props.largest,
      this.props.canvasHeight,
      options.xWidth,
      this.props.margin
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