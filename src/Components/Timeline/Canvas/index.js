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


  componentWillReceiveProps(nextProps) {

    if (nextProps.scrollLeft !== this.props.scrollLeft) {
      this.setState({
        scrollLeft: nextProps.scrollLeft
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
          left={-this.state.scrollLeft + window.innerWidth / 2}
          top={this.state.markerPos.top}
          color={this.state.color}
          value={
            this.state.currentSeries && this.state.currentSeries.dataArray && this.state.currentSeries.formatValue ?
              this.state.currentSeries.formatValue(this.state.currentSeries.dataArray[this.state.currentSeries.dataArray.length - 1]) :
            this.state.currentSeries && this.state.currentSeries.dataArray ?
              this.state.currentSeries.dataArray[this.state.currentSeries.dataArray.length - 1] :
              null}
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