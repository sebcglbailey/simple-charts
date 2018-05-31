import React, { Component } from 'react';

import Line from '../Line/';

import styles from './styles.css';

class Canvas extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.getScrollPosition = this.getScrollPosition.bind(this)
    this.getHoverPosition = this.getHoverPosition.bind(this)

  }

  componentDidMount() {

    // Listen to the Canvas scrolling, and update the scroll position
    this.elem.addEventListener("scroll", this.getScrollPosition)
    
    // // Listen to the mouse moving over the canvas, and get the hover position
    // this.elem.addEventListener("mousemove", this.getHoverPosition)

    // // Listen to a touch event on the device, and remove the mouse move event if it happens
    // window.addEventListener("touch", () => {
    //   this.elem.removeEventListener("mousemove", this.getHoverPosition)
    // })

  }

  componentWillReceiveProps(nextProps) {
    // If the component is told to move to a scroll left position, set it after a timeout of 0
    if (nextProps.scrollLeft !== this.props.scrollLeft) {
      setTimeout(() => {
        this.elem.scrollLeft = nextProps.scrollLeft
      }, 0)
    }
  }

  getScrollPosition(event) {
    // Set the helper X to the current scroll left position
    let helperX = this.elem.scrollLeft

    // If there is a mouse x position set,
    // offset the helperX position by the mouse position difference 
    // to the center (if centered), if not, just the mouse position
    helperX += this.mouseX ? this.mouseX - (this.props.centered ? window.innerWidth / 2 : 0) : 0

    // If the function is set, run the update helper position function
    if (this.props.updateHelper) {
      this.props.updateHelper(helperX, this.elem.scrollLeft)
    }

  }

  getHoverPosition(event) {
    // Set the current mouse position
    this.mouseX = event.clientX
    
    // Set the hlper x position to the mouse position
    // offset by the center of the screen if graph is centered
    let helperX = this.mouseX - (this.props.centered ? window.innerWidth / 2 : 0) + this.elem.scrollLeft

    // If the function is set, run the update helper position function
    if (this.props.updateHelper) {
      this.props.updateHelper(helperX, this.elem.scrollLeft)
    }

  }

  render() {
    // Set the class name of the canvas if it is centered or not
    let className = this.props.centered ? (
      `${styles.container} ${styles.centered}`
    ) : styles.container

    return(
      <div ref={(elem) => {this.elem = elem}} className={className}>
        {this.props.children}
      </div>
    )
  }
}

export default Canvas