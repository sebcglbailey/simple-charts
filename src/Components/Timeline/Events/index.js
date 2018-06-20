import React, { Component } from 'react';

import styles from './styles.css';

class Events extends Component {

  constructor(props) {
    super(props)

    this.state = {}

    this.hide = this.hide.bind(this)
    this.show = this.show.bind(this)
  }

  componentDidMount() {

    this.setState({
      top: -this.container.parentNode.getBoundingClientRect().top + this.props.margin
    })

    this.hide()

  }

  componentWillReceiveProps(nextProps) {


    if (nextProps.eventList && nextProps.eventList.length > 0 && nextProps.eventList !== this.props.eventList) {

      this.show()

    } else if (nextProps.eventList == null) {

      this.hide()
      
    }

  }

  hide() {

    this.setState({opacity: 0})

  }

  show() {

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
      </div>
    )
  }

}

export default Events