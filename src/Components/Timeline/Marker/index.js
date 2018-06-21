import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

class Marker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      label: this.props.label,
      value: this.props.value,
      style: {
        backgroundColor: this.props.color
      }
    }
    
  }

  componentDidMount() {

    this.marker.addEventListener("click", this.props.onClick)

  }

  componentWillReceiveProps(nextProps) {
    let markerIndex, markerValue, markerPos, markerStatic;

    if (nextProps.currentLine && nextProps.scrollLeft) {
      markerIndex = nextProps.currentLine.getIndex(nextProps.scrollLeft + window.innerWidth/2)
      markerValue = nextProps.currentLine.getValue(markerIndex)
      markerValue = nextProps.currentLine && nextProps.currentLine.series && nextProps.currentLine.series.formatValue && typeof(markerValue) == "number" ? nextProps.currentLine.series.formatValue(markerValue) : markerValue
      markerPos = nextProps.currentLine.getMarkerIntersection(nextProps.scrollLeft + window.innerWidth / 2)
      markerPos = markerPos[0] ? markerPos[0] : null
      markerStatic = markerPos ? false : this.state.markerLastLeft ? this.state.markerLastLeft - nextProps.scrollLeft - window.innerWidth/2 : null
    }

    this.setState({
      label: nextProps.currentSeries ? nextProps.currentSeries.name : null,
      value: markerValue ? markerValue : this.state.value,
      markerLastLeft: markerPos ? markerPos.x : this.state.markerLastLeft,
      style: {
        backgroundColor: nextProps.currentSeries ? nextProps.currentSeries.color : null,
        top: markerPos ? markerPos.y + nextProps.margin : this.state.style && this.state.style.top ? this.state.style.top : null,
        transform: markerStatic ? `translateX(${-this.marker.offsetWidth/2 + markerStatic}px) translateY(-50%)` : `translateX(-50%) translateY(-50%)`
      }
    })

  }

  render() {
    let hasValue = typeof(this.state.value == "number") && this.state.value !== NaN

    return(
      <div
        ref={(elem) => {this.marker = elem}}
        className={styles.container}
        style={this.state.style}
      >
        <div
          ref={(elem) => {this.labels = elem}}
          className={styles.labels}
        >
          {hasValue ? (
            <div className={styles.value}>{this.state.value}</div>
          ) : null}
          {this.state.label ? (
            <div className={styles.label}>{this.state.label}</div>
          ) : null}
        </div>
      </div>
    )
  }
}



export default Marker