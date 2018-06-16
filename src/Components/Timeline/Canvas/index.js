import React, { Component } from 'react';

import styles from './styles.css';

import SVG from '../SVG/';
import Marker from '../Marker/';

class Canvas extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentSeries: this.props.currentSeries,
      currentLine: this.props.currentLine,
      visibleLines: this.props.visibleLines,
      width: this.props.width,
      length: this.props.length,
      xWidth: this.props.xWidth,
      scrollLeft: this.props.scrollLeft,
      markerPos: {
        left: 0,
        top: 0
      }
    }

  }

  componentDidMount() {

    let markerValue = this.state.currentSeries && this.state.currentSeries.dataArray && this.state.currentSeries.formatValue ?
        this.state.currentSeries.formatValue(this.state.currentSeries.dataArray[this.state.currentSeries.dataArray.length - 1]) :
      this.state.currentSeries && this.state.currentSeries.dataArray ?
        this.state.currentSeries.dataArray[this.state.currentSeries.dataArray.length - 1] :
        null

    this.setState({ markerValue: markerValue })

  }

  componentWillReceiveProps(nextProps) {
    let markerValue, markerPos;

    if (nextProps.scrollLeft !== this.props.scrollLeft) {

      if (nextProps.currentLine) {

        markerValue = nextProps.currentLine.getValue(-nextProps.scrollLeft + window.innerWidth/2)

      }

      if (nextProps.currentLine) {

        markerPos = nextProps.currentLine.getMarkerIntersection(-nextProps.scrollLeft + window.innerWidth / 2)
        markerPos = markerPos[0] ? markerPos[0] : null

        if (markerPos) {
          this.setState({
            markerPos: {
              static: false,
              top: markerPos.y,
              left: this.state.scrollLeft ? -this.state.scrollLeft + window.innerWidth / 2 : null
            },
            scrollLeft: nextProps.scrollLeft,
            markerValue: markerValue ? markerValue : this.state.markerValue ? this.state.markerValue : null
          })
        } else if (!this.state.markerPos.static) {
          this.setState({
            markerPos: {
              top: this.state.markerPos.top,
              left: this.state.markerPos.left,
              static: true
            },
            scrollLeft: nextProps.scrollLeft,
            markerValue: markerValue ? markerValue : this.state.markerValue ? this.state.markerValue : null
          })
        } else {
          this.setState({
            scrollLeft: nextProps.scrollLeft,
            markerValue: markerValue ? markerValue : this.state.markerValue ? this.state.markerValue : null
          })
        }

      } else {

        this.setState({
          scrollLeft: nextProps.scrollLeft
        })

      }
    }

    if (nextProps.currentSeries !== this.props.currentSeries) {
      this.setState({
        currentSeries: nextProps.currentSeries,
        currentLine: nextProps.currentLine,
        visibleLines: nextProps.visibleLines
      })
    }

  }


  render() {

    return (
      <div
        ref={(elem) => {this.canvas = this.canvas ? this.canvas : elem}}
        className={styles.container}
        style={{
          width: this.state.width,
          transform: `translate3d(${this.state.scrollLeft}px, 0, 0)`
        }}
      >
        <Marker
          left={this.state.markerPos.static ? this.state.markerPos.left : -this.state.scrollLeft + window.innerWidth / 2}
          top={this.state.markerPos.top}
          color={this.state.currentSeries ? this.state.currentSeries.color : null}
          value={this.state.markerValue}
          label={this.state.currentSeries ? this.state.currentSeries.name : null}
        />
        <SVG
          ref={(elem) => {this.svg = this.svg ? this.svg : elem ? elem.svg : null}}
          length={this.state.length}
          xWidth={this.state.xWidth}
        />
      </div>
    )
  }
}

export default Canvas