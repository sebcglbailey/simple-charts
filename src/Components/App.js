import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Chart, { Marker } from './Chart/';

import addEmptyData from './Chart/src/addEmptyData';
import Func from './Chart/src/functions';

import styles from './App.css';

import data from '../data/test.json';

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
    color: "#aae1ea"
  },
  {
    name: "Short Term Debt",
    data: data.data[1].values,
    filter: (value) => {
      return value.balance
    },
    color: "#f3ba8b"
  },
  {
    name: "Spending",
    data: data.data[1].values,
    filter: (value) => {
      return value.ccSpending
    },
    color: "#c77d7d",
    parent: "Short Term Debt"
  },
  {
    name: "Payments",
    data: data.data[1].values,
    filter: (value) => {
      return value.ccPayment
    },
    color: "#f7df71",
    parent: "Short Term Debt"
  },
  {
    name: "Credit Limit",
    data: data.data[1].values,
    filter: (value) => {
      return value.ccLimit
    },
    color: "#73b141",
    parent: "Short Term Debt"
  },
  {
    name: "Long Term Debt",
    data: data.data[2].values,
    filter: (value) => {
      return value.balance
    },
    color: "#f3cddd"
  }
]

series.forEach((series) => {
  addEmptyData(series, data.index)

  let dataArray = series.data.map((obj) => {
    return series.filter(obj)
  })
  series.dataArray = dataArray

  let seriesMin = Func.getSmallest(dataArray)
  let seriesMax = Func.getLargest(dataArray)

  series.min = typeof(series.min) == "number" ? series.min : seriesMin
  series.max = typeof(series.max) == "number" ? series.max : seriesMax

})

let stdMin = series[4].min
let stdMax = series[4].max

series.forEach((series) => {
  if (series.name == "Short Term Debt"
    || series.name == "Spending"
    || series.name == "Payments") {
      series.min = stdMin
      series.max = stdMax
  }
})

let length = (data.index.maxYear - data.index.minYear) * 12 + (data.index.maxMonth - data.index.minMonth)

const App = () => {
	return(
    <div className={styles.container}>
		  <Chart
        data={testData}
        series={series}
        length={length}
        centered
        marker
        margin={100}
        xAxisMarkers
      />
    </div>
	)
}

ReactDOM.render(
	<App />,
	document.getElementById("app")
);