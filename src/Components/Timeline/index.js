import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

import Graph from './Graph/';

class Timeline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      series: this.props.series,
      length: this.props.length,
      margin: this.props.margin,
      xWidth: this.props.xWidth
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <Graph
          series={this.state.series}
          length={this.state.length}
          margin={this.state.margin}
          xWidth={this.state.xWidth}        
        />
      </div>
    )
  }
}

Timeline.defaultProps = {
  xWidth: 200,
  margin: 0
}

Timeline.propTypes = {
  series: PropTypes.array.isRequired
}

export default Timeline