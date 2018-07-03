import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Chart, { Marker } from './Chart/';
import Timeline from './Timeline/';

import addEmptyData from './Timeline/src/addEmptyData';
import formatUndefined from './Timeline/src/formatUndefined'
import Func from './Timeline/src/functions';

import styles from './App.css';

import data from '../data/test2.json';

let testData = data.data[0].values.map((score) => {
  return score.score
})

let series = [
  {
    name: "Credit Score",
    default: true,
    data: data.data[0].values,
    filter: (value) => {
      return value.score
    },
    min: 0,
    max: 700,
    color: "#aae1ea",
    children: ["Short Term Debt", "Long Term Debt"]
  },
  {
    name: "Short Term Debt",
    data: data.data[1].values,
    filter: (value) => {
      return value.balance
    },
    formatValue: (value) => {
      return Func.formatMoney(value)
    },
    color: "#f3ba8b",
    children: ["Credit Score", "Spending", "Payments", "Credit Limit"]
  },
  {
    name: "Spending",
    data: data.data[1].values,
    filter: (value) => {
      return value.ccSpending
    },
    formatValue: (value) => {
      return Func.formatMoney(value)
    },
    color: "#c77d7d",
    parent: "Short Term Debt",
    children: ["Credit Score", "Short Term Debt", "Payments", "Credit Limit"]
  },
  {
    name: "Payments",
    data: data.data[1].values,
    filter: (value) => {
      return value.ccPayment
    },
    formatValue: (value) => {
      return Func.formatMoney(value)
    },
    color: "#f7df71",
    parent: "Short Term Debt",
    children: ["Credit Score", "Short Term Debt", "Spending", "Credit Limit"]
  },
  {
    name: "Credit Limit",
    data: data.data[1].values,
    filter: (value) => {
      return value.ccLimit
    },
    formatValue: (value) => {
      return Func.formatMoney(value)
    },
    color: "#73b141",
    parent: "Short Term Debt",
    children: ["Credit Score", "Short Term Debt", "Payments", "Spending"]
  },
  {
    name: "Long Term Debt",
    data: data.data[2].values,
    filter: (value) => {
      return value.balance
    },
    formatValue: (value) => {
      return Func.formatMoney(value)
    },
    color: "#f3cddd",
    children: ["Credit Score", "Short Term Debt"],
    min: 0
  }
]

series.forEach((series) => {
  addEmptyData(series, data.index)

  let dataArray = series.data.map((obj) => {
    return series.filter(obj)
  })
  series.dataArray = dataArray

  let seriesMax = Func.getLargest(dataArray)

  series.max = typeof(series.max) == "number" ? series.max : seriesMax

})

let stdMaxes = series.map((series) => {
  if (series.name == "Short Term Debt"
    || series.name == "Spending"
    || series.name == "Payments"
    || series.name == "Credit Limit") {
      return series.max
  } else {
    return
  }
})
let stdMax = Func.getLargest(stdMaxes)

series.forEach((series) => {
  if (series.name == "Short Term Debt"
    || series.name == "Spending"
    || series.name == "Payments"
    || series.name == "Credit Limit") {
      series.min = 0
      series.max = stdMax
  }
})

series.forEach((series, seriesIndex) => {

  formatUndefined(series)

})

let length = (data.index.maxYear - data.index.minYear) * 12 + (data.index.maxMonth - data.index.minMonth) + 1

class App extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      xWidth: window.innerWidth / 3 < 200 ? window.innerWidth / 3 : 200
    }
  }

  componentDidMount() {

    window.addEventListener("resize", () => {
      this.setState({ xWidth: window.innerWidth / 3 < 200 ? window.innerWidth / 3 : 200})
    })

  }

  // render() {
  // 	return(
  //     <div className={styles.container}>
  // 		  <Chart
  //         data={testData}
  //         series={series}
  //         length={length-1}
  //         centered
  //         marker
  //         margin={100}
  //         xAxisMarkers
  //         xWidth={this.state.xWidth}
  //       />
  //     </div>
  // 	)
  // }

  render() {
    return(
      <div className={styles.container}>
        <Timeline
          series={series}
          length={length}
          xWidth={this.state.xWidth}
          margin={32}
        />
      </div>
    )
  }

}

ReactDOM.render(
	<App />,
	document.getElementById("app")
);