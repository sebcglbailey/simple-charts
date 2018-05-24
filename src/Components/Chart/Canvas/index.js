import React, { Component } from 'react';

import styles from './styles.css';

class Canvas extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.getHeight = this.getHeight.bind(this)
    this.getScrollPosition = this.getScrollPosition.bind(this)
    this.getHoverPosition = this.getHoverPosition.bind(this)

  }

  componentDidMount() {

    this.getHeight()

    this.elem.addEventListener("scroll", this.getScrollPosition)
    this.elem.addEventListener("mousemove", this.getHoverPosition)

    window.addEventListener("touchstart", () => {
      this.touch = true
      this.elem.removeEventListener("mousemove", () => {
        return
      })
    })

  }

  getScrollPosition() {

    let helperX = this.elem.scrollLeft

    helperX += this.mouseX ? this.mouseX - (this.props.centered ? window.innerWidth / 2 : 0) : 0

    if (this.props.updateHelper) {
      this.props.updateHelper(helperX)
    }

  }

  getHoverPosition(event) {

    this.mouseX = event.clientX
    
    let helperX = this.mouseX - (this.props.centered ? window.innerWidth / 2 : 0) + this.elem.scrollLeft

    if (this.props.updateHelper) {
      this.props.updateHelper(helperX)
    }

  }

  getHeight() {
    let canvasHeight = this.elem.offsetHeight

    if (this.props.margin) {
      canvasHeight -= this.props.margin * 2
    }

    this.setState({ canvasHeight: canvasHeight })
    return canvasHeight
  }

  render() {

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