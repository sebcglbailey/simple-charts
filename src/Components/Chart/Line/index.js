import React, { Component } from 'react';
import Snap from 'snapsvg-cjs';
import Func from '../src/functions';

import Type from '../src/lineTypes';

import styles from './styles.css';

class Line {
  constructor(props) {

    this.state = {
      name: props.name,
      data: props.data,
      smallest: props.smallest,
      largest: props.largest,
      canvasHeight: props.canvasHeight,
      xWidth: props.xWidth,
      margin: props.margin,
      snap: props.snap,
      color: props.color,
      parent: props.parent,
      children: props.children
    }

    this.plotData()

  }

  // Plot the data on the canvas
  plotData() {

    this.curve = Type.strictCurve(
      this.state.data,
      this.state.smallest,
      this.state.largest,
      this.state.canvasHeight,
      this.state.xWidth,
      this.state.margin
    )

    this.bgCurve = Type.addClose(
      this.curve,
      this.state.data,
      this.state.smallest,
      this.state.canvasHeight,
      this.state.xWidth,
      this.state.margin
    )

    this.start = Type.start(
      this.state.data,
      this.state.canvasHeight,
      this.state.xWidth,
      this.state.margin
    )

    this.bgStart = Type.addClose(
      this.start,
      this.state.data,
      this.state.canvasHeight,
      this.state.xWidth,
      this.state.margin
    )

    this.line = this.state.snap ? this.state.snap.path(this.curve) : null
    this.bg = this.state.snap ? this.state.snap.path(this.bgCurve) : null

    let bgColor1 = Func.hexToRgb(this.state.color, 0.5)
    let bgColor2 = Func.hexToRgb(this.state.color, 0)
    let bgStop = 1 - Func.median(this.state.data) / this.state.largest
    
    if (this.state.snap) { 
      let bgFill = this.state.snap.gradient(`l(0.5,0.4,0.5,0.8)${bgColor1}:${bgStop}-${bgColor2}:0`);

      this.line.attr({
        fill: "none",
        stroke: this.state.color,
        opacity: 0.5,
        strokeLinecap: "round"
      })
      this.bg.attr({
        fill: bgFill,
        opacity: 0.5
      })

      if (this.state.parent) {
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
      this.state.data,
      this.state.smallest,
      this.state.largest,
      this.state.canvasHeight,
      options.xWidth,
      this.state.margin
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
    // parentNode.insertAfter(domElem, parentChildren[parentChildren.length-1])

  }

}

Line.defaultProps = {
  smallest: 0,
  largest: 100,
  canvasHeight: 600,
  xWidth: 200,
  margin: 32
}

export default Line