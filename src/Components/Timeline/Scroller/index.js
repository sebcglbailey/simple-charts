import React, { Component } from 'react';

import styles from './styles.css';

import Func from '../src/functions';

class Scroller extends Component {
  constructor(props) {
    super(props)

    this.state = {
      width: this.props.width
    }

    this.updateScrollPosition = this.updateScrollPosition.bind(this)
  }

  componentDidMount() {

    this.container.addEventListener("scroll", (event) => {
      this.updateScrollPosition(event)
    })

  }

  updateScrollPosition(e) {

    if (this.props.onScroll) {

      this.props.onScroll(e.srcElement.scrollLeft - window.innerWidth / 2)

    }

  }

  render() {
    return (
      <div
        ref={(elem) => {this.container = this.container ? this.container : elem}}
        className={styles.container}
      >
        <div
          className={styles.helper}
          style={{
            width: this.state.width
          }}
        >
        </div>
      </div>
    )
  }
}

export default Scroller