import React, { Component } from 'react';

import styles from './styles.css';

class Events extends Component {

  constructor(props) {
    super(props)

    this.state = {
      svgWidth: this.props.svgWidth,
      margin: this.props.margin
    }

    this.hide = this.hide.bind(this)
    this.show = this.show.bind(this)
  }

  componentDidMount() {

    this.setState({
      top: -this.container.parentNode.getBoundingClientRect().top + this.props.margin,
      svgTop: this.container.getBoundingClientRect().top + this.props.margin
    })

    this.hide()

  }

  componentWillReceiveProps(nextProps) {


    if (nextProps.eventList && nextProps.eventList.length > 0 && nextProps.eventList !== this.props.eventList) {

      this.show(nextProps.currentLine)

    } else if (nextProps.eventList == null) {

      this.hide()

    }

    if (nextProps.scrollLeft !== this.props.scrollLeft) {
      this.setState({
        scrollLeft: nextProps.scrollLeft,
        svgWidth: nextProps.svgWidth
      })
    }

  }

  hide() {

    while (this.svg && this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild)
    }

    this.setState({opacity: 0})

  }

  show(currentLine) {

    let line = currentLine && currentLine.line ? currentLine.line.node : null
    let lineCopy = line.cloneNode()
    this.svg.appendChild(lineCopy)

    this.setState({opacity: 1})

  }

  render() {

    return(
      <div
        ref={(elem) => {this.container = elem}}
        className={styles.container}
        style={{
          top: this.state.top,
          opacity: this.state.opacity
        }}
      >
        <svg
          ref={(elem) => {this.svg = elem}}
          className={styles.svg}
          style={{
            width: this.state.svgWidth,
            top: this.state.svgTop,
            transform: `translate3d(${this.state.scrollLeft}px, 0, 0)`
          }}
        >
        </svg>
      </div>
    )
  }

}

export default Events