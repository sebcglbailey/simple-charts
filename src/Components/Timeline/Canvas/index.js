import React, { Component } from 'react';

import styles from './styles.css';

import SVG from '../SVG/';
import Marker from '../Marker/';

class Canvas extends Component {
  constructor(props) {
    super(props)

    this.state = {
      width: this.props.width,
      length: this.props.length,
      xWidth: this.props.xWidth,
      scrollLeft: this.props.scrollLeft,
    }

  }

  componentWillReceiveProps(nextProps) {

    this.setState({
      scrollLeft: nextProps.scrollLeft
    })

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